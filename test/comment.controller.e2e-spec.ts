import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CommentModule } from '../src/comment/comment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createConnection, getConnection } from 'typeorm';
import { User } from '../src/entities/user.entity';
import { Comment } from '../src/entities/comment.entity';
import { Post } from '../src/entities/post.entity';
import { PostLike } from '../src/entities/post_like.entity';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }), // ConfigService를 사용하기 위해서 import
                TypeOrmModule.forRootAsync({
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService) => {
                        return {
                            type: 'mysql',
                            host: configService.get('DB_HOST'),
                            port: 3306,
                            username: configService.get('DB_USERNAME'),
                            password: configService.get('DB_PASSWORD'),
                            database: configService.get('DB_DATABASE'),
                            entities: [User, Post, Comment, PostLike],
                            synchronize: true,
                            charset: 'utf8mb4',
                            logging: false,
                        };
                    },
                }),
                CommentModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/comment (POST)', () => {
        return request(app.getHttpServer())
            .post('/comment')
            .send({ userId: 1, postId: 1, content: '댓글' })
            .expect(200);
    });
});
