import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentInputDto } from './dto/input/createComment.dto';
import { CommentOutputDto } from './dto/output/comment.dto';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    async createComment(@Body() body: CreateCommentInputDto): Promise<void> {
        await this.commentService.createComment(body);
        return;
    }

    @Get('/:postId')
    async getComments(@Param('postId') postId: number): Promise<CommentOutputDto[]> {
        return await this.commentService.getComments(postId);
    }

    @Put('/:postId/:commentId')
    async updateComment(@Param('postId') postId: number, @Param('commentId') commentId: number, @Body() body) {
        await this.commentService.updateComment(postId, commentId, body);
        return;
    }
}
