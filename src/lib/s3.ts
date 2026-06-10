import "server-only";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

import type { S3UploadFolder } from "./s3-constants";

export type { S3UploadFolder } from "./s3-constants";
export { S3_UPLOAD_FOLDERS } from "./s3-constants";

export type S3MediaKind = "image" | "video";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

function allowedTypesFor(kind: S3MediaKind): Set<string> {
  return kind === "video" ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;
}

export function isS3Configured(): boolean {
  return Boolean(process.env.AWS_S3_BUCKET && process.env.AWS_REGION);
}

function getS3Client(): S3Client {
  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error("AWS_REGION no configurada");
  }

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  return new S3Client({
    region,
    ...(accessKeyId && secretAccessKey
      ? { credentials: { accessKeyId, secretAccessKey } }
      : {}),
  });
}

function sanitizeBaseName(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, "");
  return base
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function buildObjectKey(
  folder: S3UploadFolder,
  fileName: string,
  contentType: string,
  mediaKind: S3MediaKind = "image"
): string {
  if (!allowedTypesFor(mediaKind).has(contentType)) {
    throw new Error("Tipo de archivo no permitido");
  }
  const ext = EXT_BY_TYPE[contentType] ?? "bin";
  const safeName = sanitizeBaseName(fileName) || "asset";
  return `club/${folder}/${randomUUID()}-${safeName}.${ext}`;
}

export function getPublicObjectUrl(key: string): string {
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;
  if (!bucket || !region) {
    throw new Error("AWS_S3_BUCKET o AWS_REGION no configuradas");
  }

  const customBase = process.env.AWS_S3_PUBLIC_URL_BASE?.replace(/\/$/, "");
  if (customBase) {
    return `${customBase}/${key}`;
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export async function createPresignedUploadUrl(input: {
  folder: S3UploadFolder;
  fileName: string;
  contentType: string;
  mediaKind?: S3MediaKind;
}): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) {
    throw new Error("AWS_S3_BUCKET no configurado");
  }

  const key = buildObjectKey(
    input.folder,
    input.fileName,
    input.contentType,
    input.mediaKind ?? "image"
  );
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: input.contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });
  const publicUrl = getPublicObjectUrl(key);

  return { uploadUrl, publicUrl, key };
}
