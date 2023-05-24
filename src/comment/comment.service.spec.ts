import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ICommentRepository } from './comment.interface';
import { CommentService } from './comment.service';
import { CommentOutputDto } from './dto/output/comment.dto';
import { PostOutputDto } from './dto/output/post.dto';

const mockData = {
    post: {
        id: 1,
        userId: 1,
        category: '게시판',
        title: '제목',
        content: '내용',
        createdAt: new Date('2022-05-20'),
    },

    comment: [
        {
            id: 1,
            userId: 1,
            postId: 1,
            content: '댓글 내용',
            createdAt: new Date('2022-05-20'),
        },
        {
            id: 2,
            userId: 2,
            postId: 1,
            content: '댓글 내용 2',
            createdAt: new Date('2022-05-21'),
        },
    ],
};

export class FakeCommentRepository implements ICommentRepository {
    createComment(userId: number, postId: number, content: string): Promise<void> {
        return;
    }

    async findOnePost(postId: number): Promise<PostOutputDto> {
        return mockData.post;
    }

    async getCommentsByPostId(postId: number): Promise<CommentOutputDto[]> {
        return mockData.comment;
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
        it('commentRepository의 함수들을 올바르게 호출하는지 확인', async () => {
            const body = { userId: 1, postId: 1, content: '댓글 입니다' };
            jest.spyOn(commentRepository, 'createComment').mockResolvedValue(null);
            jest.spyOn(commentRepository, 'findOnePost').mockResolvedValue(mockData.post);
            await commentService.createComment(body);
            expect(commentRepository.createComment).toHaveBeenCalledWith(body.userId, body.postId, body.content);
            expect(commentRepository.findOnePost).toHaveBeenCalledWith(body.postId);
        });

        it('null을 리턴하는지 확인', async () => {
            const body = { userId: 1, postId: 1, content: '댓글 입니다' };
            const result = await commentService.createComment(body);
            expect(result).toEqual(undefined);
        });

        it('post가 존재하지 않는 경우', async () => {
            const body = { userId: 1, postId: 1, content: '댓글 입니다' };
            jest.spyOn(commentRepository, 'findOnePost').mockResolvedValue(null);
            await expect(commentService.createComment(body)).rejects.toThrowError(
                new BadRequestException('존재하지 않는 게시글 입니다'),
            );
        });
    });

    describe('getComments', () => {
        it('내부의 함수들을 올바르게 호출하는지 확인', async () => {
            const body = { postId: 1 };
            jest.spyOn(commentRepository, 'getCommentsByPostId').mockResolvedValue(mockData.comment);
            jest.spyOn(commentRepository, 'findOnePost').mockResolvedValue(mockData.post);
            await commentService.getComments(body);
            expect(commentRepository.getCommentsByPostId).toHaveBeenCalledWith(body.postId);
        });

        it('댓글 배열을 리턴하는지 확인', async () => {
            const body = { postId: 1 };
            const result = await commentService.getComments(body);
            expect(result).toEqual(mockData.comment);
        });

        it('post가 존재하지 않는 경우', async () => {
            const body = { postId: 2 };
            jest.spyOn(commentRepository, 'findOnePost').mockResolvedValue(null);
            await expect(commentService.getComments(body)).rejects.toThrowError(
                new BadRequestException('존재하지 않는 게시글 입니다'),
            );
        });
    });
});
