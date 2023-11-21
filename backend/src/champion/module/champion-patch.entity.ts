import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Champion } from './champion.entity';
import { Patch } from 'src/patch/module/patch.entity';
import { ChampionDTO } from './dto/champion.dto';
import { SpellDTO, passiveDTO } from './dto/spell.dto';

@Entity()
export class ChampionPatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' }) // Use 'jsonb' type for JSON data (specific to your database)
  championData: ChampionDTO; // Store champion data as JSON in ChampionDTO format per patch

  @Column({ type: 'jsonb' }) // Use 'jsonb' type for JSON data (specific to your database)
  passive: passiveDTO[]; // Store champion spells as JSON in passiveDTO format per patch

  @Column({ type: 'jsonb' }) // Use 'jsonb' type for JSON data (specific to your database)
  spells: SpellDTO[]; // Store champion spells as JSON in SpellDTO format per patch

  @ManyToOne(() => Champion, (champion) => champion.championPatches)
  @JoinColumn({ name: 'championId' })
  champion: Champion;

  @ManyToOne(() => Patch, (patch) => patch.championPatches)
  @JoinColumn({ name: 'patchId' })
  patch: Patch;
}
