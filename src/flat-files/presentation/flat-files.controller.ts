import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileFlatUseCase } from '../application/services/upload-file-flat.use-case';

@Controller('flat-files')
export class FlatFilesController {
    constructor(private readonly uploadFileFlatUseCase: UploadFileFlatUseCase) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadFileFlatUseCase.execute(file);
  }
}
