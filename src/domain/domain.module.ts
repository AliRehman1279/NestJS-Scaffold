import { Module } from '@nestjs/common';
import { DomainController } from './domain.controller';
import { DomainService } from './domain.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Domain, DomainSchema } from './schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Domain.name, schema: DomainSchema }]),
  ],
  controllers: [DomainController],
  providers: [DomainService],
})
export class DomainModule {}
