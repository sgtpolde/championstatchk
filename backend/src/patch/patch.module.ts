import { TypeOrmModule } from '@nestjs/typeorm';
import { PatchController } from './patch.controller';
import { PatchService } from './patch.service';
import { Module } from '@nestjs/common';
import { Patch } from './module/patch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patch])],
  controllers: [PatchController],
  providers: [PatchService],
})
export class PatchModule {}
