export const S3_UPLOAD_FOLDERS = [
  "events",
  "projects",
  "banners",
  "team",
  "communities",
  "services",
  "brand",
] as const;

export type S3UploadFolder = (typeof S3_UPLOAD_FOLDERS)[number];
