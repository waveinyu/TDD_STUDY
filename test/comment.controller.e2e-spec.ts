import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CommentModule } from '../src/comment/comment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { createConnection, getConnection } from 'typeorm';
import { Comment } from '../src/entities/comment.entity';
import { Post } from '../src/entities/post.entity';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                CommentModule,
                TypeOrmModule.forRootAsync({
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService) => {
                        return {
                            type: 'mysql',
                            host: 'localhost',
                            port: 3306,
                            username: configService.get('DB_USERNAME'),
                            password: configService.get('DB_PASSWORD'),
                            database: configService.get('DB_DATABASE'),
                            entities: [Post, Comment],
                            synchronize: false,
                            charset: 'utf8mb4',
                            logging: false,
                        };
                    },
                }),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/comment (GET)', () => {
        return request(app.getHttpServer()).get('/comment').send({ userId: 1, postId: 1, content: '댓글' }).expect(200);
    });
});
