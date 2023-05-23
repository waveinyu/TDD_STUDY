import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { ICommentRepository } from './comment.interface';
import { Post } from '../entities/post.entity';

@Injectable()
export class CommentRepository implements ICommentRepository {
    constructor(
        @InjectRepository(Comment) private commentModel: Repository<Comment>,
        @InjectRepository(Post) private postModel: Repository<Post>,
    ) {}

    async createComment(userId: number, postId: number, content: string): Promise<void> {
        const newComment = this.commentModel.create();
        newComment.userId = userId;
        newComment.postId = postId;
        newComment.content = content;
        await this.commentModel.save(newComment);
        return;
    }

    async findOnePost(postId: number) {
        return await this.postModel.findOne({ where: { id: postId } });
    }
}
