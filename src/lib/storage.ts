import { env } from "$env/dynamic/private";
import { FileStorage } from "@flystorage/file-storage";

async function createAdapter() {
  if (env.AWS_ENDPOINT_URL_S3 && env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.BUCKET_NAME) {
    const { S3Client } = await import("@aws-sdk/client-s3");
    const { AwsS3StorageAdapter } = await import("@flystorage/aws-s3");

    // S3 client
    const client = new S3Client({
      region: env.AWS_REGION ?? "auto",
      endpoint: env.AWS_ENDPOINT_URL_S3,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
    return new AwsS3StorageAdapter(client, { bucket: env.BUCKET_NAME });
  } else {
    const { LocalStorageAdapter } = await import("@flystorage/local-fs");

    // Filesystem client
    return new LocalStorageAdapter(`${process.cwd()}/storage`, {
      publicUrlOptions: {
        baseUrl: "/storage",
      },
    });
  }
}

// Create storage with adapter
const adapter = await createAdapter();
export const storage = new FileStorage(adapter);
