import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ChampionService } from './champion.service';
import { SpellDTO } from './module/dto/spell.dto';
import { ChampionSpellDTO } from './module/dto/champion.dto';

@Controller('champion')
export class ChampionController {
  constructor(private readonly championService: ChampionService) {}

  /* ~~~~~~~~~~~~~~~ ||   BASIC ENDPOINTS FOR CHAMPIONS  || ~~~~~~~~~~~~~~~~~~~~~~~ */

  //Get all champions from the database
  @Get()
  async getAllChampions(): Promise<any[]> {
    return this.championService.all();
  }

  @Get('/initialize')
  async saveChampionStats(): Promise<string> {
    try {
      await this.championService.saveBasicChampionInfo();
      return `Champion stats saved successfully.`;
    } catch (error) {
      return `Failed to save champion stats. Error: ${error.message}`;
    }
  }

  @Get('initialiteChampionPatch/:patchVersion')
  async saveChampionPatchData1(
    @Param('patchVersion') patchVersion: string,
  ): Promise<void> {
    try {
      await this.championService.initializeChampionPatchData(patchVersion);
    } catch (error) {
      console.error(
        'Error saving or fetching ChampionPatch data:',
        error.message,
      );
      throw error;
    }
  }

  @Get(':patchVersion/:championId')
  async saveChampionPatchData(
    @Param('patchVersion') patchVersion: string,
    @Param('championId') championId: string,
  ): Promise<string> {
    try {
      await this.championService.saveChampionPatchData(
        patchVersion,
        championId,
      );
      return `ChampionPatch data for champion ${championId} and patch ${patchVersion} saved successfully.`;
    } catch (error) {
      console.error(
        `Error saving ChampionPatch data for champion ${championId} and patch ${patchVersion}:`,
        error.message,
      );
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /* ~~~~~~~~~~~~~~~ ||   LOGIC FOR RETRIEVING DATA FOR CHAMPION - PATCH RELATION|| ~~~~~~~~~~~~~~~~~~~~~~~ */

  // TODO: Refactor these 2 functions
  @Get('/:patchVersion/:championId/allinfo')
  async getAllChampionSpells(
    @Param('patchVersion') patchVersion: string,
    @Param('championId') championId: string,
  ): Promise<any> {
    try {
      const championInfo = await this.championService.getChampData(
        patchVersion,
        championId,
      );
      if (!championInfo) {
        throw new NotFoundException('Champion data not found.');
      }
      return championInfo;
    } catch (error) {
      console.error('Error retrieving champion data:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve champion data.',
      );
    }
  }

  @Get(':patchVersion/:championId/spells')
  async getChampionSpells(
    @Param('patchVersion') patchVersion: string,
    @Param('championId') championId: string,
  ): Promise<SpellDTO[]> {
    try {
      const spells = await this.championService.getChampionSpellsForPatch(
        patchVersion,
        championId,
      );
      if (!spells) {
        throw new NotFoundException('Champion spells not found.');
      }
      return spells;
    } catch (error) {
      console.error('Error retrieving champion spells:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve champion spells.',
      );
    }
  }

  /* ~~~~~~~~~~~~~~~ ||   ENDPOINTS FOR CHANGES FOR CHAMPION ON PATCH || ~~~~~~~~~~~~~~~~~~~~~~~ */

  @Get('compare/:championId/:patch1/:patch2')
  async compareSpells(
    @Param('championId') championId: string,
    @Param('patch1') patch1: string,
    @Param('patch2') patch2: string,
  ): Promise<any> {
    // Fetch spells for patch1 and patch2
    const spellPatch1 = await this.championService.getChampionSpellsForPatch(
      patch1,
      championId,
    );
    const spellPatch2 = await this.championService.getChampionSpellsForPatch(
      patch2,
      championId,
    );

    // Compare spells using the service
    return this.championService.compareSpells(spellPatch1, spellPatch2);
  }

  /* ~~~~~~~~~~~~~~~ || END || ~~~~~~~~~~~~~~~~~~~~~~~ */
}
