import "server-only";

import { createSign } from "node:crypto";

type Ga4Row = { dimension: string; metric: number };

type Ga4Report = {
  sources: Ga4Row[];
  devices: Ga4Row[];
};

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

function base64Url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createServiceAccountJwt(sa: ServiceAccount): string {
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const claim = base64Url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );

  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const signature = signer.sign(
    sa.private_key.replace(/\\n/g, "\n"),
    "base64"
  );
  const sigUrl = signature
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${header}.${claim}.${sigUrl}`;
}

async function getAccessToken(sa: ServiceAccount): Promise<string | null> {
  const jwt = createServiceAccountJwt(sa);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

function parseServiceAccountJson(raw: string): ServiceAccount | null {
  try {
    const parsed = JSON.parse(raw) as ServiceAccount;
    if (!parsed.client_email || !parsed.private_key) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function runGa4Report(
  propertyId: string,
  accessToken: string,
  dimensions: string[],
  metrics: string[]
): Promise<Ga4Row[]> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: dimensions.map((name) => ({ name })),
        metrics: metrics.map((name) => ({ name })),
        limit: 8,
      }),
    }
  );

  if (!res.ok) return [];

  const data = (await res.json()) as {
    rows?: Array<{
      dimensionValues?: Array<{ value?: string }>;
      metricValues?: Array<{ value?: string }>;
    }>;
  };

  return (data.rows ?? []).map((row) => ({
    dimension: row.dimensionValues?.[0]?.value ?? "(not set)",
    metric: Number.parseInt(row.metricValues?.[0]?.value ?? "0", 10) || 0,
  }));
}

export function isGa4DataApiConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_ANALYTICS_PROPERTY_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  );
}

export async function fetchGa4TrafficReport(): Promise<Ga4Report | null> {
  const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
  const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!propertyId || !rawJson) return null;

  const sa = parseServiceAccountJson(rawJson);
  if (!sa) return null;

  const token = await getAccessToken(sa);
  if (!token) return null;

  const [sources, devices] = await Promise.all([
    runGa4Report(propertyId, token, ["sessionSourceMedium"], ["sessions"]),
    runGa4Report(propertyId, token, ["deviceCategory"], ["sessions"]),
  ]);

  return { sources, devices };
}
