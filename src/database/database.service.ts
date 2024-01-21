import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements MongooseOptionsFactory {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get('DATABASE_URI', { infer: true }),
      dbName: this.configService.get('DATABASE_NAME', { infer: true }),
      user: this.configService.get('DATABASE_USER', { infer: true }),
      pass: this.configService.get('DATABASE_PASSWORD', { infer: true }),
    };
  }

  async handleConnection(connection: Connection): Promise<void> {
    this.logger.log(`MongoDB connected to ${connection.name}`);
  }
}
