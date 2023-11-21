import { Controller, Get } from '@nestjs/common';
import { PatchService } from './patch.service';
import { Patch } from './module/patch.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('patches')
export class PatchController {
  constructor(private readonly patchService: PatchService) {}

  @Get('latest')
  async getLatestPatch(): Promise<string> {
    const currentPatch = await this.patchService.getCurrentPatch();
    return currentPatch ? currentPatch.version : '';
  }

  @Get('all')
  async getAllPatches(): Promise<Patch[]> {
    return (await this.patchService.all()).reverse();
  }
  @Cron(CronExpression.EVERY_WEEK) // Run the cron job daily
  @Get('update')
  async updatePatches(): Promise<string> {
    console.log('Running cron job...');
    await this.patchService.updatePatches();
    const currentPatch = await this.patchService.getCurrentPatch();
    return currentPatch ? currentPatch.version : '';
  }
}
