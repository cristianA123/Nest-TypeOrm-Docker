import { FileValidator } from '@nestjs/common';

export const FILE_TYPE = /(jpg|jpeg|png|gif)$/;

export const MAX_UPLOAD_SIZE = 10; // Value in MB

export const MAX_UPLOAD_SIZE_IN_BYTES = MAX_UPLOAD_SIZE * 1000000;

export const MAX_UPLOAD_FILES = 5;

export class MaxFileSize extends FileValidator<{ maxSize: number }> {
  constructor(options: { maxSize: number }) {
    super(options);
  }

  isValid(file: Express.Multer.File): boolean | Promise<boolean> {
    const sizeInMB = file.size / 1000000;
    return sizeInMB <= this.validationOptions.maxSize;
  }

  buildErrorMessage(): string {
    return `File uploaded is too big. Max size is (${this.validationOptions.maxSize} MB)`;
  }
}

export class ValidFileTypes extends FileValidator<{ fileType: RegExp }> {
  constructor(options: { fileType: RegExp }) {
    super(options);
  }

  isValid(file: Express.Multer.File): boolean | Promise<boolean> {
    return this.validationOptions.fileType.test(file.originalname);
  }

  buildErrorMessage(): string {
    return `File uploaded is not a valid file type. Valid file types are (${this.validationOptions.fileType})`;
  }
}

// Clase no funciona ya que se itara una a una las imagenes no en conjunto
export class MaxQuantityFiles extends FileValidator<{ maxQuantity: number }> {
  constructor(options: { maxQuantity: number }) {
    super(options);
  }

  isValid(files: Express.Multer.File[]): boolean | Promise<boolean> {
    return files.length <= this.validationOptions.maxQuantity;
  }

  buildErrorMessage(): string {
    return `Max quantity of files is ${this.validationOptions.maxQuantity}`;
  }
}
