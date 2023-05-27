import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { PostModule } from './post/post.module';
import { LikeModule } from './like/like.module';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { PostLike } from './entities/post_like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        UserModule,
        CommentModule,
        PostModule,
        LikeModule,
        RavenModule,
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
                    entities: [User, Post, Comment, PostLike],
                    synchronize: false,
                    charset: 'utf8mb4',
                    logging: false,
                };
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService, { provide: APP_INTERCEPTOR, useValue: new RavenInterceptor() }],
})
export class AppModule {}
