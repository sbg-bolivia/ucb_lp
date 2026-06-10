const s3Bucket = process.env.AWS_S3_BUCKET;
const s3Region = process.env.AWS_REGION ?? "us-east-1";

/** @type {import("next").NextConfig} */
const config = {
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
    ],
  },
};

export default config;
