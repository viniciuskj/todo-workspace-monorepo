import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { DomainCommentService } from '../../domain/services/DomainCommentService';
import {
  CommentRequest,
  commentRequestSchema,
  CommentResponse,
} from '@my-workspace/shared-dtos';
import { Comment } from '../../domain/entities/Comment';
import { Response, Request } from 'express';
import { v4 as uuid } from 'uuid';

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
      identifier: uuid(),
      content: validatedCommentRequest.content,
      authorIdentifier: author.identifier,
      taskIdentifier: validatedCommentRequest.taskIdentifier,
    });

    await this.commentService.create(createdComment);

    const commentResponse: CommentResponse = {
      identifier: createdComment.identifier,
      content: createdComment.content,
      authorIdentifier: createdComment.authorIdentifier,
      taskIdentifier: createdComment.taskIdentifier,
    };

    return res.status(HttpStatus.CREATED).json(commentResponse);
  }

  @Get('identifier')
  async getCommentDetails(
    @Param('identifier') identifier: string,
    @Res() res: Response
  ): Promise<Response<CommentResponse>> {
    const comment = await this.commentService.readOne(identifier);

    const commentResponse: CommentResponse = {
      identifier: comment.identifier,
      content: comment.content,
      authorIdentifier: comment.authorIdentifier,
      taskIdentifier: comment.taskIdentifier,
    };

    return res.status(HttpStatus.OK).json(commentResponse);
  }

  @Get('task/:taskIdentifier')
  async getComments(
    @Param('taskIdentifier') taskIdentifier: string,
    @Res() res: Response
  ): Promise<Response<CommentResponse[]>> {
    const comments = await this.commentService.readMany(taskIdentifier);

    const commentResponses: CommentResponse[] = comments.map((comment) => ({
      identifier: comment.identifier,
      content: comment.content,
      authorIdentifier: comment.authorIdentifier,
      taskIdentifier: comment.taskIdentifier,
    }));

    return res.status(HttpStatus.OK).json(commentResponses);
  }

  @Put('identifier')
  async updateComment(
    @Param('identifier') identifier: string,
    @Body() commentRequest: CommentRequest,
    @Res() res: Response
  ): Promise<Response<CommentResponse>> {
    const currentComment = await this.commentService.readOne(identifier);

    currentComment.content = commentRequest.content;

    await this.commentService.update(currentComment);

    const commentResponse: CommentResponse = {
      identifier: currentComment.identifier,
      content: currentComment.content,
      authorIdentifier: currentComment.authorIdentifier,
      taskIdentifier: currentComment.taskIdentifier,
    };

    return res.status(HttpStatus.OK).json(commentResponse);
  }

  @Delete('identifier')
  async deleteComment(
    @Param('identifier') identifier: string,
    @Res() res: Response
  ): Promise<Response<void>> {
    await this.commentService.delete(identifier);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
