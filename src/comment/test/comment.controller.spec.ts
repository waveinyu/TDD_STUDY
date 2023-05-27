import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from '../comment.controller';
import { ICommentRepository } from '../comment.interface';
import { CommentService } from '../comment.service';
import { FakeCommentRepository, mockData } from './comment.service.spec';

describe('CommentController', () => {
    let commentController: CommentController;
    let commentService: CommentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CommentController],
            providers: [CommentService, { provide: ICommentRepository, useClass: FakeCommentRepository }],
        }).compile();

        commentService = module.get<CommentService>(CommentService);
        commentController = module.get<CommentController>(CommentController);
    });

    it('should be defined', () => {
        expect(commentController).toBeDefined();
    });

    describe('createComment', () => {
        it('존재하는지 확인', async () => {
            expect(commentController.createComment).toBeDefined();
        });

        it('서비스의 createComment를 호출하는지 확인', async () => {
            const body = { userId: 1, postId: 1, content: '댓글 입니다' };
            jest.spyOn(commentService, 'createComment').mockResolvedValue(null);
            await commentController.createComment(body);
            expect(commentService.createComment).toHaveBeenCalledWith(body);
        });
    });

    describe('getComments', () => {
        it('서비스의 getComments를 호출하는지 확인', async () => {
            const postId = 1;
            jest.spyOn(commentService, 'getComments').mockResolvedValue(mockData.comments);
            await commentController.getComments(postId);
            expect(commentService.getComments).toHaveBeenCalledWith(postId);
        });
    });

    describe('/:postId/:commentId', () => {
        it('서비스의 updateComment를 호출하는지 확인', async () => {
            const postId = 1;
            const commentId = 1;
            const body = { content: '수정된 댓글' };
            jest.spyOn(commentService, 'updateComment').mockResolvedValue(null);
            await commentController.updateComment(postId, commentId, body);
            expect(commentService.updateComment).toHaveBeenCalledWith(postId, commentId, body);
        });
    });
});
