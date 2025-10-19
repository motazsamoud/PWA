
export interface StorageServiceInterface {
  upload(file: Express.Multer.File, path: string): Promise<string>;
  delete(path: string): Promise<void>;
  getSignedUrl(path: string): Promise<string>;
}
