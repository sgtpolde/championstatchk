import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patch } from './module/patch.entity';
import { AbstractService } from 'src/common/abstract.service';

@Injectable()
export class PatchService extends AbstractService {
  private readonly logger = new Logger(PatchService.name);

  constructor(
    @InjectRepository(Patch)
    private readonly patchRepository: Repository<Patch>,
  ) {
    super(patchRepository);
  }

  /* ~~~~~~~~~~~~~~~ ||   LOGIC FOR ALL PATCHS || ~~~~~~~~~~~~~~~~~~~ */

  //Get latest patch in the databse
  async getCurrentPatch(): Promise<Patch | undefined> {
    return this.patchRepository.findOne({ where: { currentPatch: true } });
  }

  /* ~~~~~~~~~~~~~~~ ||   LOGIC FOR API CALLS || ~~~~~~~~~~~~~~~~~~~~~~~ */

  //Get all of the patches from DDRAGON
  async fetchAvailablePatches(): Promise<string[]> {
    try {
      const response = await axios.get(
        'https://ddragon.leagueoflegends.com/api/versions.json',
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching available patches:', error);
      throw new Error('Failed to fetch available patches from Riot API.');
    }
  }

  /* ~~~~~~~~~~~~~~~ ||   LOGIC FOR INITIALIZATION || ~~~~~~~~~~~~~~~~~~ */

  //Initializing the patches in db
  async initializePatches(availablePatches: string[]): Promise<void> {
    const patchesToSave = availablePatches.map((version, index) => {
      const patch = new Patch();
      patch.version = version;
      patch.currentPatch = index === 0;
      return patch;
    });

    await this.patchRepository.save(patchesToSave.reverse());
    this.logger.log('Patches initialized.');
  }

  /* ~~~~~~~~~~~~~~~ ||   LOGIC FOR ROLLBACK || ~~~~~~~~~~~~~~~~~~~~~~~ */

  //Rollback check logic
  async isRollbackNeeded(
    currentPatch: Patch,
    availablePatches: string[],
  ): Promise<boolean> {
    const latestPatch = availablePatches[0];
    this.logger.log(`Latest patch from API: ${latestPatch}`);
    this.logger.log(`Latest patch from db: ${currentPatch.version}`);
    this.logger.log(
      `Is rollback needed: ${latestPatch < currentPatch.version}`,
    );
    return latestPatch < currentPatch.version;
  }

  //Patch rollback logic
  async rollbackToPreviousPatch(
    currentPatch: Patch,
    availablePatches: string[],
  ): Promise<void> {
    if (availablePatches.length > 0) {
      const previousPatchVersion = availablePatches[0];
      const previousPatch = await this.patchRepository.findOne({
        where: { version: previousPatchVersion },
      });

      if (previousPatch) {
        currentPatch.currentPatch = false;
        await this.patchRepository.save(currentPatch);

        previousPatch.currentPatch = true;
        await this.patchRepository.save(previousPatch);

        await this.patchRepository.remove(currentPatch);
        this.logger.log(`Rolled back to patch: ${previousPatch.version}`);
      } else {
        this.logger.error('Error: Previous patch not found.');
      }
    } else {
      this.logger.error(
        'Error: No previous patch available. Cannot perform rollback.',
      );
    }
  }
  /* ~~~~~~~~~~~~~~~ ||   LOGIC FOR UPDATING DATA || ~~~~~~~~~~~~~~~~~~~ */

  //Adding latest patch to the db
  async updateToLatestPatch(
    currentPatch: Patch,
    latestPatch: string,
  ): Promise<void> {
    if (!currentPatch || currentPatch.version !== latestPatch) {
      const newPatch = new Patch();
      newPatch.version = latestPatch;
      newPatch.currentPatch = true;

      const savedNewPatch = await this.patchRepository.save(newPatch);

      if (currentPatch) {
        currentPatch.currentPatch = false;
        await this.patchRepository.save(currentPatch);
      }

      this.logger.log(`New patch saved: ${savedNewPatch.version}`);
    }
  }

  //Updating the patches in db
  async updatePatches(): Promise<void> {
    try {
      const availablePatches = await this.fetchAvailablePatches();
      const currentPatch = await this.getCurrentPatch();

      if (!currentPatch) {
        // Handle the case where there is no current patch in the database
        await this.initializePatches(availablePatches);
        return;
      }

      if (await this.isRollbackNeeded(currentPatch, availablePatches)) {
        await this.rollbackToPreviousPatch(currentPatch, availablePatches);
      } else {
        const latestPatch = availablePatches[0];

        // Check if there are patches between currentPatch and latestPatch
        const patchesToUpdate = availablePatches.slice(1);
        const patchesToUpdateIndexes = patchesToUpdate.findIndex(
          (patch) => patch === currentPatch.version,
        );

        if (patchesToUpdateIndexes !== -1) {
          // Save the patches between currentPatch and latestPatch
          for (let i = patchesToUpdateIndexes - 1; i >= 0; i--) {
            await this.updateToLatestPatch(currentPatch, patchesToUpdate[i]);
          }
        }

        // Update to the latest patch
        await this.updateToLatestPatch(currentPatch, latestPatch);
      }
    } catch (error) {
      this.logger.error('Error updating patches:', error);
      throw new Error('Failed to update patches.');
    }
  }

  /* ~~~~~~~~~~~~~~~~~~~ ||   END || ~~~~~~~~~~~~~~~~~~~~~~~ */
}
