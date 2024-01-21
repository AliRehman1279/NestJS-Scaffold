import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DomainModule } from './domain/domain.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database/database.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UserModule,
    DomainModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useClass: DatabaseService,
      inject: [DatabaseService],
    }),
  ],
  controllers: [],
  providers: [DatabaseService],
})
export class AppModule {}
