import { ChampionPatch } from 'src/champion/module/champion-patch.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Patch {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  version: string;

  @Column()
  currentPatch: boolean;

  @OneToMany(() => ChampionPatch, (championPatch) => championPatch.patch)
  championPatches: ChampionPatch[];
}
