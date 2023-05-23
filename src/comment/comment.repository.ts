import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentRepository {
    constructor(@InjectRepository(Comment) private commentModel: Repository<Comment>) {}

    async createComment(userId: number, postId: number, content: string): Promise<void> {
        const newComment = this.commentModel.create();
        newComment.userId = userId;
        newComment.postId = postId;
        newComment.content = content;
        await this.commentModel.save(newComment);
        return;
    }
}
