import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { ICommentRepository } from './comment.interface';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

const mockData = {
    post: { id: 1, userId: 1, category: '게시판', title: '제목', content: '내용', createdAt: '2023-05-23' },
};
export class FakeCommentRepository implements ICommentRepository {
    createComment(userId: number, postId: number, content: string): Promise<void> {
        return;
    }

    findOnePost(postId: number) {
        const result = {
            id: 1,
            userId: 1,
            category: '게시판',
            title: '제목',
            content: '내용',
            createdAt: '2023-05-23',
        };
        return result;
    }
}

describe('CommentService', () => {
    let commentService: CommentService;
    let commentRepository: ICommentRepository;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CommentService, { provide: ICommentRepository, useClass: FakeCommentRepository }],
        }).compile();

        commentRepository = module.get<ICommentRepository>(ICommentRepository);
        commentService = module.get<CommentService>(CommentService);
    });

    it('should be defined', () => {
        expect(commentService).toBeDefined();
    });

    describe('createComment', () => {
        it('commentRepository의 createComment를 호출하는지 확인', async () => {
            const body = { userId: 1, postId: 1, content: '댓글 입니다' };
            jest.spyOn(commentRepository, 'createComment').mockResolvedValue(null);
            await commentService.createComment(body);
            expect(commentRepository.createComment).toHaveBeenCalledWith(body.userId, body.postId, body.content);
        });

        it('commentRepository의 findOnePost를 호출하는지 확인', async () => {
            const body = { userId: 1, postId: 1, content: '댓글 입니다' };
            jest.spyOn(commentRepository, 'findOnePost').mockResolvedValue(mockData.post);
            await commentService.createComment(body);
            expect(commentRepository.findOnePost).toHaveBeenCalledWith(body.postId);
        });

        it('post가 존재하지 않는 경우', async () => {
            const body = { userId: 1, postId: 1, content: '댓글 입니다' };
            jest.spyOn(commentRepository, 'findOnePost').mockResolvedValue(null);
            await expect(commentService.createComment(body)).rejects.toThrowError(
                new BadRequestException('없는 게시글 입니다'),
            );
        });
    });
});
