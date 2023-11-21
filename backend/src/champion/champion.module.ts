import { Module } from '@nestjs/common';
import { ChampionService } from './champion.service';
import { ChampionController } from './champion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Champion } from './module/champion.entity';
import { ChampionPatch } from './module/champion-patch.entity';
import { Patch } from 'src/patch/module/patch.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Champion, ChampionPatch, Patch])],
  controllers: [ChampionController],
  providers: [ChampionService],
})
export class ChampionModule {}
