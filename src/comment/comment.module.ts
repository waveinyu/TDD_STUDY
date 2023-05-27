import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { CommentRepository } from './comment.repository';
import { ICommentRepository } from './comment.interface';
import { Post } from '../entities/post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comment, Post])],
    controllers: [CommentController],
    providers: [CommentService, { provide: ICommentRepository, useClass: CommentRepository }],
})
export class CommentModule {}
