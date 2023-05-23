import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentInputDto } from './dto/input/createComment.dto';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    async createComment(body: CreateCommentInputDto): Promise<void> {
        await this.commentService.createComment(body);
        return;
    }
}
