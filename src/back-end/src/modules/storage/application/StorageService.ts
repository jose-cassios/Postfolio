import { IStorageService, StorageHealthContract, StoredImageContract } from "@storage/domain/interfaces/IStorageService";
import { BadRequest, InternalServerError } from "@shared/error/HttpError";
import { Client } from "minio";
import { randomUUID } from "node:crypto";
import { injectable } from "inversify";

interface DetectedImage {
  extension: "jpg" | "png" | "webp" | "gif";
  mimeType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
}

interface MinioRuntimeConfig {
  client: Client;
  bucket: string;
  publicBaseUrl: string;
  region: string;
}

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

@injectable()
export class StorageService implements IStorageService {
  private runtime: MinioRuntimeConfig | null = null;
  private initialization: Promise<MinioRuntimeConfig> | null = null;

  async uploadImage(userId: string, content: Buffer): Promise<StoredImageContract> {
    if (!content.length) throw new BadRequest("Selecione uma imagem para enviar.");
    if (content.length > MAX_IMAGE_SIZE) {
      throw new BadRequest("A imagem deve ter no maximo 8 MB.");
    }

    const detected = this.detectImage(content);
    if (!detected) {
      throw new BadRequest("Formato invalido. Use JPG, PNG, WebP ou GIF.");
    }

    const runtime = await this.getRuntime();
    const now = new Date();
    const objectKey = [
      "users",
      userId,
      String(now.getUTCFullYear()),
      String(now.getUTCMonth() + 1).padStart(2, "0"),
      `${randomUUID()}.${detected.extension}`,
    ].join("/");

    try {
      await runtime.client.putObject(
        runtime.bucket,
        objectKey,
        content,
        content.length,
        {
          "Content-Type": detected.mimeType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      );
    } catch (error) {
      console.error("Falha no upload para o MinIO:", this.errorMessage(error));
      throw new InternalServerError("Nao foi possivel armazenar a imagem.");
    }

    return {
      url: `${runtime.publicBaseUrl}/${encodeURIComponent(runtime.bucket)}/${this.encodeObjectKey(objectKey)}`,
      objectKey,
      mimeType: detected.mimeType,
      size: content.length,
    };
  }

  async health(): Promise<StorageHealthContract> {
    if (!this.hasRequiredEnvironment()) {
      return { configured: false, reachable: false, bucket: null };
    }

    try {
      const runtime = await this.getRuntime();
      return {
        configured: true,
        reachable: await runtime.client.bucketExists(runtime.bucket),
        bucket: runtime.bucket,
      };
    } catch {
      return {
        configured: true,
        reachable: false,
        bucket: process.env.MINIO_BUCKET ?? null,
      };
    }
  }

  private async getRuntime(): Promise<MinioRuntimeConfig> {
    if (this.runtime) return this.runtime;
    if (!this.initialization) this.initialization = this.initialize();

    try {
      this.runtime = await this.initialization;
      return this.runtime;
    } catch (error) {
      this.initialization = null;
      if (error instanceof InternalServerError) throw error;
      console.error("Falha ao configurar o MinIO:", this.errorMessage(error));
      throw new InternalServerError("Storage MinIO indisponivel ou configurado incorretamente.");
    }
  }

  private async initialize(): Promise<MinioRuntimeConfig> {
    const accessKey = process.env.MINIO_ACCESS_KEY?.trim();
    const secretKey = process.env.MINIO_SECRET_KEY?.trim();
    const rawEndpoint = process.env.MINIO_ENDPOINT?.trim();
    const bucket = process.env.MINIO_BUCKET?.trim() || "postfolio-images";
    const region = process.env.MINIO_REGION?.trim() || "us-east-1";

    if (!accessKey || !secretKey || !rawEndpoint) {
      throw new InternalServerError(
        "Configure MINIO_ENDPOINT, MINIO_ACCESS_KEY e MINIO_SECRET_KEY.",
      );
    }
    if (!/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(bucket)) {
      throw new InternalServerError("MINIO_BUCKET possui um nome invalido.");
    }

    const endpoint = this.parseEndpoint(rawEndpoint);
    const client = new Client({
      endPoint: endpoint.hostname,
      port: endpoint.port,
      useSSL: endpoint.useSSL,
      accessKey,
      secretKey,
      region,
      pathStyle: true,
    });

    if (!(await client.bucketExists(bucket))) {
      await client.makeBucket(bucket, region);
    }

    await client.setBucketPolicy(bucket, JSON.stringify({
      Version: "2012-10-17",
      Statement: [{
        Effect: "Allow",
        Principal: { AWS: ["*"] },
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      }],
    }));

    const publicBaseUrl = (
      process.env.MINIO_PUBLIC_URL?.trim()
      || `${endpoint.useSSL ? "https" : "http"}://${endpoint.hostname}${this.publicPort(endpoint)}`
    ).replace(/\/+$/, "");

    return { client, bucket, publicBaseUrl, region };
  }

  private parseEndpoint(rawEndpoint: string): {
    hostname: string;
    port: number;
    useSSL: boolean;
  } {
    const normalized = /^https?:\/\//i.test(rawEndpoint)
      ? rawEndpoint
      : `${this.envBoolean("MINIO_USE_SSL", false) ? "https" : "http"}://${rawEndpoint}`;
    const parsed = new URL(normalized);
    const useSSL = parsed.protocol === "https:";
    const configuredPort = Number(process.env.MINIO_PORT);
    const port = Number.isInteger(configuredPort) && configuredPort > 0
      ? configuredPort
      : parsed.port
        ? Number(parsed.port)
        : useSSL
          ? 443
          : 9000;

    return { hostname: parsed.hostname, port, useSSL };
  }

  private publicPort(endpoint: { port: number; useSSL: boolean }): string {
    const defaultPort = endpoint.useSSL ? 443 : 80;
    return endpoint.port === defaultPort ? "" : `:${endpoint.port}`;
  }

  private envBoolean(name: string, fallback: boolean): boolean {
    const value = process.env[name]?.trim().toLowerCase();
    if (!value) return fallback;
    return value === "true" || value === "1";
  }

  private hasRequiredEnvironment(): boolean {
    return Boolean(
      process.env.MINIO_ENDPOINT?.trim()
      && process.env.MINIO_ACCESS_KEY?.trim()
      && process.env.MINIO_SECRET_KEY?.trim(),
    );
  }

  private detectImage(content: Buffer): DetectedImage | null {
    if (
      content.length >= 3
      && content[0] === 0xff
      && content[1] === 0xd8
      && content[2] === 0xff
    ) return { extension: "jpg", mimeType: "image/jpeg" };

    if (
      content.length >= 8
      && content.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    ) return { extension: "png", mimeType: "image/png" };

    if (
      content.length >= 12
      && content.toString("ascii", 0, 4) === "RIFF"
      && content.toString("ascii", 8, 12) === "WEBP"
    ) return { extension: "webp", mimeType: "image/webp" };

    if (content.length >= 6) {
      const signature = content.toString("ascii", 0, 6);
      if (signature === "GIF87a" || signature === "GIF89a") {
        return { extension: "gif", mimeType: "image/gif" };
      }
    }

    return null;
  }

  private encodeObjectKey(objectKey: string): string {
    return objectKey.split("/").map(encodeURIComponent).join("/");
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "erro desconhecido";
  }
}
