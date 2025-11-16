import ImageKit from 'imagekit';

if (!process.env.IMAGEKIT_PUBLIC_KEY) {
  throw new Error('IMAGEKIT_PUBLIC_KEY environment variable is not set');
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  throw new Error('IMAGEKIT_PRIVATE_KEY environment variable is not set');
}

if (!process.env.IMAGEKIT_URL_ENDPOINT) {
  throw new Error('IMAGEKIT_URL_ENDPOINT environment variable is not set');
}

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function uploadFile(
  file: Buffer | string,
  fileName: string,
  folder: string = 'uploads'
) {
  try {
    const result = await imagekit.upload({
      file,
      fileName,
      folder,
      useUniqueFileName: true,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('ImageKit upload failed:', error);
    return { success: false, error };
  }
}

export async function deleteFile(fileId: string) {
  try {
    await imagekit.deleteFile(fileId);
    return { success: true };
  } catch (error) {
    console.error('ImageKit delete failed:', error);
    return { success: false, error };
  }
}

export function getAuthenticationParameters() {
  return imagekit.getAuthenticationParameters();
}

export async function getFileDetails(fileId: string) {
  try {
    const result = await imagekit.getFileDetails(fileId);
    return { success: true, data: result };
  } catch (error) {
    console.error('ImageKit getFileDetails failed:', error);
    return { success: false, error };
  }
}

export async function listFiles(options?: {
  skip?: number;
  limit?: number;
  searchQuery?: string;
  path?: string;
}) {
  try {
    const result = await imagekit.listFiles(options);
    return { success: true, data: result };
  } catch (error) {
    console.error('ImageKit listFiles failed:', error);
    return { success: false, error };
  }
}
