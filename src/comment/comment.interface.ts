import { CommentOutputDto } from './dto/output/comment.dto';
import { PostOutputDto } from './dto/output/post.dto';

export interface ICommentRepository {
    createComment(userId: number, postId: number, content: string): Promise<void>;
    findOnePost(postId: number): Promise<PostOutputDto>;
    getCommentsByPostId(postId: number): Promise<CommentOutputDto[]>;
}

export const ICommentRepository = Symbol('ICommentRepository');
