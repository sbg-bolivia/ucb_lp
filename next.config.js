const s3Bucket = process.env.S3_BUCKET ?? process.env.AWS_S3_BUCKET;
const s3Region =
  process.env.S3_REGION ?? process.env.AWS_REGION ?? "us-east-1";

const s3PublicBase =
  process.env.S3_PUBLIC_URL_BASE ?? process.env.AWS_S3_PUBLIC_URL_BASE;

/** @type {import("next").NextConfig} */
const config = {
  compress: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "motion/react",
      "@react-three/drei",
      "@react-three/fiber",
    ],
  },
  async redirects() {
    return [
      {
        source: "/signin",
        destination: "/login",
        permanent: true,
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      ...(s3Bucket
        ? /** @type {Array<{ protocol: "https"; hostname: string }>} */ ([
            {
              protocol: "https",
              hostname: `${s3Bucket}.s3.${s3Region}.amazonaws.com`,
            },
            {
              protocol: "https",
              hostname: `${s3Bucket}.s3.amazonaws.com`,
            },
          ])
        : []),
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      ...(s3PublicBase
        ? (() => {
            try {
              const host = new URL(s3PublicBase).hostname;
              return /** @type {const} */ ([
                { protocol: "https", hostname: host },
              ]);
            } catch {
              return [];
            }
          })()
        : []),
    ],
  },
};

export default config;
