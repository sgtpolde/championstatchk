import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ChampionPatch } from './champion-patch.entity';
import { ChampionImageDTO } from './dto/champion.dto';

@Entity()
export class Champion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @Column()
  name: string;

  @Column()
  title: string;

  @Column()
  blurb: string;

  @Column({ type: 'jsonb' })
  image: ChampionImageDTO;

  @OneToMany(() => ChampionPatch, (championPatch) => championPatch.champion)
  championPatches: ChampionPatch[];
}
