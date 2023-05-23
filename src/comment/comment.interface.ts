export interface ICommentRepository {
    createComment(userId: number, postId: number, content: string): Promise<void>;
    findOnePost(postId: number);
}

export const ICommentRepository = Symbol('ICommentRepository');
