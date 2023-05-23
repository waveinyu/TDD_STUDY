import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ICommentRepository } from './comment.interface';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
    constructor(@Inject(ICommentRepository) private commentRepository: ICommentRepository) {}

    async createComment(body): Promise<void> {
        const { userId, postId, content } = body;
        const post = await this.commentRepository.findOnePost(postId);
        if (!post) throw new BadRequestException('없는 게시글 입니다');
        await this.commentRepository.createComment(userId, postId, content);
        return;
    }
}
