import { ContentType, FileOrFolder } from "../components/HomeScreen";
import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  ListObjectsV2CommandOutput,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

class AWSS3Client {
  private client: S3Client;

  public constructor() {
    this.client = new S3Client({
      region: "ap-south-1",
      credentials: {
        accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID!,
        secretAccessKey: process.env.REACT_APP_ACCESS_KEY_SECRET!,
      },
    });
  }

  public async listObjectsInBucket(
    bucketName: string,
    prefix: string
  ): Promise<FileOrFolder[]> {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    });
    const response: ListObjectsV2CommandOutput = await this.client.send(
      command
    );
    const items =
      response.Contents?.map((item) => {
        if (item.Key?.endsWith("/")) {
          return { name: item.Key!, type: ContentType.Folder };
        }
        return { name: item.Key!, type: ContentType.File };
      }) || [];
    return items;
  }
  public async uploadFileToBucket(
    bucketName: string,
    key: string,
    file?: File
  ) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
    });
    const response = await this.client.send(command);
  }
  public async deleteFileOrFolderFromBucket(bucketName: string, key: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const response = await this.client.send(command);
  }
  public async downloadFileFromBucket(bucketName: string, key: string) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const response = await this.client.send(command);
    return response.Body;
  }
}

export const s3Client = new AWSS3Client();
