import "server-only";

/**
 * Amplify Hosting no permite variables de entorno con prefijo `AWS_`.
 * En producción usa `S3_*`; en local puedes seguir con `AWS_*` (fallback).
 *
 * En Amplify, deja vacías las claves: el SDK usa el rol IAM del servicio.
 */
export function getS3Env() {
  return {
    region: process.env.S3_REGION ?? process.env.AWS_REGION,
    bucket: process.env.S3_BUCKET ?? process.env.AWS_S3_BUCKET,
    accessKeyId:
      process.env.S3_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:
      process.env.S3_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY,
    publicUrlBase:
      process.env.S3_PUBLIC_URL_BASE ?? process.env.AWS_S3_PUBLIC_URL_BASE,
  };
}
