/**
 * S3 호환 스토리지 유틸리티
 * 이미지 업로드 및 관리
 */

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * S3 클라이언트 초기화
 */
const s3Client = new S3Client({
  endpoint: process.env.STORAGE_ENDPOINT,
  region: process.env.STORAGE_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.STORAGE_KEY || '',
    secretAccessKey: process.env.STORAGE_SECRET || '',
  },
  forcePathStyle: true, // S3 호환 스토리지용
});

const BUCKET_NAME = process.env.STORAGE_BUCKET || 'baroolim';

/**
 * 이미지 업로드
 * @param file - 업로드할 파일 (Buffer 또는 Uint8Array)
 * @param fileName - 파일명
 * @param contentType - 파일 타입
 * @returns 업로드된 파일의 URL
 */
export async function uploadImage(
  file: Buffer | Uint8Array,
  fileName: string,
  contentType: string = 'image/jpeg'
): Promise<string> {
  const key = `images/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // 파일 URL 반환 (공개 읽기 권한이 있다고 가정)
  const baseUrl = process.env.STORAGE_ENDPOINT?.replace(/\/$/, '') || '';
  return `${baseUrl}/${BUCKET_NAME}/${key}`;
}

/**
 * Base64 이미지를 업로드
 * @param base64Image - Base64 인코딩된 이미지
 * @param fileName - 파일명
 * @returns 업로드된 파일의 URL
 */
export async function uploadBase64Image(base64Image: string, fileName: string): Promise<string> {
  // Base64 데이터에서 데이터 URL 헤더 제거
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  // MIME 타입 추출
  const mimeMatch = base64Image.match(/^data:image\/(\w+);base64,/);
  const contentType = mimeMatch ? `image/${mimeMatch[1]}` : 'image/jpeg';

  return uploadImage(buffer, fileName, contentType);
}

/**
 * 파일 URL 가져오기
 * @param key - S3 객체 키
 * @returns 파일 URL
 */
export function getFileUrl(key: string): string {
  const baseUrl = process.env.STORAGE_ENDPOINT?.replace(/\/$/, '') || '';
  return `${baseUrl}/${BUCKET_NAME}/${key}`;
}

/**
 * 서명된 URL 생성 (임시 접근용)
 * @param key - S3 객체 키
 * @param expiresIn - 만료 시간 (초)
 * @returns 서명된 URL
 */
export async function getSignedFileUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

