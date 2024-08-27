import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/auth/entities/user.entity';
import { validate as IsUUID } from 'uuid';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(user: User, createPostDto: CreatePostDto) {
    const post = this.postRepository.create({
      user,
      ...createPostDto,
    });

    try {
      await this.postRepository.save(post);
      return post;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    const posts = await this.postRepository.find();
    if (posts.length === 0)
      throw new BadRequestException('List of posts are empty');
    return posts;
  }

  async findOne(term: string) {
    let post: Post;

    if (IsUUID(term)) {
      post = await this.postRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.postRepository.createQueryBuilder();
      post = await queryBuilder
        .where(`UPPER(title) =:title`, {
          title: term.toUpperCase(),
        })
        .getOne();
    }

    if (!post) {
      throw new BadRequestException(`Post whit ${term} not found`);
    }

    return post;
  }

  async update(id: string, user: User, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new BadRequestException(
        `Not found Post whit id: ${id} in database`,
      );
    }
    if (post.user.id !== user.id) {
      throw new BadRequestException(
        'The post can only be modified by the person who created it.',
      );
    }

    const updatedPost = await this.postRepository.preload({
      id: id,
      user,
      updatedAt: new Date(),
      ...updatePostDto,
    });

    await this.postRepository.save(updatedPost);
    return updatedPost;
  }

  async remove(id: string, user: User) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new BadRequestException(
        `Not found Post whit id: ${id} in database`,
      );
    }

    if (post.user.id !== user.id) {
      throw new BadRequestException(
        'The post can only be modified by the person who created it.',
      );
    }

    const { affected } = await this.postRepository.delete(id);

    if (affected === 0) {
      throw new BadRequestException(
        `No posts with this id : ${id} found in the database`,
      );
    }
  }

  private handleErrors(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
  }
}
