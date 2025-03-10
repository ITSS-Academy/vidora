import { Controller, Get, Request } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get()
  async getHistoryByUserId(@Request() req: any) {
    const { userId } = req.query;
    return await this.historyService.getHistoryByUserId(userId);
  }

  @Get('clear')
  async clearHistoryByUserId(@Request() req: any) {
    const { userId } = req.query;
    return await this.historyService.clearHistoryByUserId(userId);
  }

  @Get('remove')
  async removeVideoFromHistory(@Request() req: any) {
    const { userId, videoId } = req.query;
    return await this.historyService.removeVideoFromHistory(videoId, userId);
  }

  @Get('search')
  async searchHistoryByUserId(@Request() req: any) {
    const { userId, search } = req.query;
    return await this.historyService.searchHistoryByUserId(userId, search);
  }
}
