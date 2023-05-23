import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { CommentRepository } from './comment.repository';
import { ICommentRepository } from './comment.interface';

@Module({
    imports: [TypeOrmModule.forFeature([Comment])],
    controllers: [CommentController],
    providers: [CommentService, { provide: ICommentRepository, useClass: CommentRepository }],
})
export class CommentModule {}
