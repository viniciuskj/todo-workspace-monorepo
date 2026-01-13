import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { DomainCommentService } from '../../domain/services/DomainCommentService';
import {
  CommentRequest,
  commentRequestSchema,
  CommentResponse,
} from '@my-workspace/shared-dtos';
import { Comment } from '../../domain/entities/Comment';
import { Response, Request } from 'express';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: DomainCommentService) {}

  @Post()
  async createComment(
    @Body() commentRequest: CommentRequest,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Response<CommentResponse>> {
    const author = req.user;

    const validatedCommentRequest = commentRequestSchema.parse(commentRequest);

    const createdComment = new Comment({
      content: validatedCommentRequest.content,
      authorIdentifier: author.identifier,
      taskIdentifier: validatedCommentRequest.taskIdentifier,
    });

    await this.commentService.create(createdComment);

    return res.status(HttpStatus.CREATED).json(createdComment);
  }
}
