import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { ChampionPatch } from './module/champion-patch.entity';
import { Champion } from './module/champion.entity';
import {
  ChampionAPIResponse,
  ChampionDTO,
  ChampionDataDTO,
  ChampionSpellDTO,
} from './module/dto/champion.dto';
import { SpellDTO, passiveDTO } from './module/dto/spell.dto';
import { Patch } from 'src/patch/module/patch.entity';
import { AbstractService } from 'src/common/abstract.service';

interface SpellDifference {
  spellKey: string;
  changes: Change[];
}

interface Change {
  property: string;
  oldValue: any;
  newValue: any;
}
@Injectable()
export class ChampionService extends AbstractService {
  constructor(
    @InjectRepository(Champion)
    private readonly championRepository: Repository<Champion>,
    @InjectRepository(ChampionPatch)
    private readonly championPatchRepository: Repository<ChampionPatch>,
    @InjectRepository(Patch)
    private readonly patchRepository: Repository<Patch>,
  ) {
    super(championRepository);
  }

  /* ~~~~~~~~~~~~~~~ ||   LOGIC FOR API CALLS || ~~~~~~~~~~~~~~~~~~~~~~~ */

  private async fetchDataFromAPI<T>(url: string): Promise<T> {
    try {
      const response = await axios.get<T>(url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('API Error Response:', error.response.status);
        } else if (error.request) {
          console.error('API No Response Received');
        } else {
          console.error('API Error:', error.message);
        }
      }
      throw new Error('Failed to fetch data from API.');
    }
  }

  /* ~~~~~~~~~~~~~~~ ||   LOGIC FOR CHAMPION FETCHING AND SAVING|| ~~~~~~~~~~~~~~~~~~~~~~~ */

  async saveBasicChampionInfo(): Promise<void> {
    try {
      // Get the current patch version from the patch repository
      const patchVersion = await this.patchRepository.findOne({
        where: { currentPatch: true },
      });

      // Construct the API endpoint URL using the patch version
      const endpoint = `http://ddragon.leagueoflegends.com/cdn/${patchVersion.version}/data/en_US/champion.json`;

      // Fetch champion data from the API
      const championAPIResponse =
        await this.fetchDataFromAPI<ChampionAPIResponse>(endpoint);
      const championData: ChampionDataDTO = championAPIResponse.data;

      // Update or save champion data in the database
      const updatePromises = Object.values(championData).map(
        async (championStats) => {
          const existingChampion = await this.championRepository.findOne({
            where: { key: championStats.key },
          });

          if (existingChampion) {
            // Check if the champion data has changed
            const isDataChanged =
              existingChampion.name !== championStats.name ||
              existingChampion.title !== championStats.title ||
              existingChampion.blurb !== championStats.blurb ||
              JSON.stringify(existingChampion.image.full) !==
                JSON.stringify(championStats.image.full);

            if (isDataChanged) {
              // Update the existing champion data
              return this.championRepository.update(existingChampion.id, {
                name: championStats.name,
                title: championStats.title,
                blurb: championStats.blurb,
                image: championStats.image,
              });
            } else {
              // Skip the champion if the data is already up-to-date
              console.log(
                `Champion ${championStats.name} data is already up-to-date. Skipping.`,
              );
              return;
            }
          } else {
            // Save the new champion data
            return this.championRepository.save({
              key: championStats.key,
              name: championStats.name,
              title: championStats.title,
              blurb: championStats.blurb,
              image: championStats.image,
            });
          }
        },
      );

      // Wait for all update promises to resolve
      await Promise.all(updatePromises);

      console.log(
        `Champion stats for patch ${patchVersion.version} processed successfully.`,
      );
    } catch (error) {
      console.error('Error fetching or saving champion stats:', error.message);
      throw error;
    }
  }

  //TODO: Make it so we can save all of the champions at the same time.
  async saveChampionPatchData(
    patchVersion: string,
    championId: string,
  ): Promise<void> {
    // Construct the API endpoint URL
    const endpoint = `https://cdn.communitydragon.org/${patchVersion}/champion/${championId}/data`;

    try {
      // Fetch champion patch data from the API
      const championPatchData =
        await this.fetchDataFromAPI<ChampionDTO>(endpoint);

      // Destructure the champion patch data object
      const { passive, spells, ...championData } = championPatchData;

      // Find the patch and champion in the database
      const [patch, champion] = await Promise.all([
        this.patchRepository.findOne({ where: { version: patchVersion } }),
        this.championRepository.findOne({ where: { key: championId } }),
      ]);

      // Find the existing champion patch in the database
      let championPatch = await this.championPatchRepository.findOne({
        where: {
          champion: { key: championId },
          patch: { version: patchVersion },
        },
        relations: ['champion', 'patch'],
      });

      if (!championPatch) {
        // Create a new champion patch if it doesn't exist
        championPatch = await this.championPatchRepository.create({
          championData,
          passive,
          spells,
          patch,
          champion,
        });
        championPatch = await this.championPatchRepository.save(championPatch);
      } else {
        // Update the existing champion patch
        championPatch.championData = championPatchData;
        championPatch.passive = passive;
        championPatch.spells = spells;
        await this.championPatchRepository.save(championPatch);
      }

      console.log(
        `ChampionPatch data for champion ${championId} and patch ${patchVersion} saved successfully.`,
      );
    } catch (error) {
      // Handle errors
      console.error(
        `Error fetching or saving ChampionPatch data for champion ${championId} and patch ${patchVersion}:`,
        error.message,
      );
      throw error;
    }
  }

  /* ~~~~~~~~~~~~~~~ ||   LOGIC FOR RETRIEVING DATA FOR CHAMPION - PATCH RELATION|| ~~~~~~~~~~~~~~~~~~~~~~~ */

  // TODO: Refactor these 2 functions
  async getChampionSpellsForPatch(
    patchVersion: string,
    championId: string,
  ): Promise<SpellDTO[]> {
    try {
      const championPatch = await this.championPatchRepository.findOne({
        where: {
          patch: { version: patchVersion },
          champion: { key: championId },
        },
      });

      if (championPatch && championPatch.spells) {
        return championPatch.spells as SpellDTO[];
      }

      throw new NotFoundException('Champion patch data not found.');
    } catch (error) {
      console.error('Error retrieving champion spells:', error);
      throw new Error('Failed to retrieve champion spells.');
    }
  }

  async getChampData(patchVersion: string, championId: string) {
    const res = await this.championPatchRepository.findOne({
      where: {
        champion: { key: championId },
        patch: { version: patchVersion },
      },
      relations: ['champion', 'patch'],
    });
    if (!res) {
      throw new Error('Failed to retrieve champion spells.');
    }
    return res;
  }

  async compareSpells(
    oldSpell: SpellDTO[],
    newSpell: SpellDTO[],
    tolerance: number = 0.0001,
  ): Promise<SpellDifference[]> {
    const differences: SpellDifference[] = [];
  
    const areNumbersEqual = (num1: number, num2: number): boolean => {
      return Math.abs(num1 - num2) < tolerance;
    };
  
    const compareObjects = (obj1: any, obj2: any): SpellDifference | null => {
      const diff: SpellDifference = {
        spellKey: obj1.spellKey,
        changes: [],
      };
  
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
  
      for (const key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];
  
        if (typeof val1 === 'object' && typeof val2 === 'object') {
          const nestedDiff = compareObjects(val1, val2);
          if (nestedDiff) {
            diff.changes.push(...nestedDiff.changes);
          }
        } else if (typeof val1 === 'number' && typeof val2 === 'number') {
          if (!areNumbersEqual(val1, val2)) {
            diff.changes.push({
              property: key,
              oldValue: val1,
              newValue: val2,
            });
          }
        } else if (typeof val1 === 'string' && typeof val2 === 'string') {
          if (val1 !== val2) {
            diff.changes.push({
              property: key,
              oldValue: val1,
              newValue: val2,
            });
          }
        } else if (val1 !== val2) {
          diff.changes.push({
            property: key,
            oldValue: val1,
            newValue: val2,
          });
        }
      }
  
      return diff.changes.length > 0 ? diff : null;
    };
  
    for (const [index, spell] of oldSpell.entries()) {
      const spellDifferences = compareObjects(spell, newSpell[index]);
      if (spellDifferences) {
        differences.push({
          spellKey: spell.spellKey,
          changes: spellDifferences.changes,
        });
      }
    }
  
    return differences;
  }
y  
  

  /* ~~~~~~~~~~~~~~~ ||  END || ~~~~~~~~~~~~~~~~~~~~~~~ */
}
