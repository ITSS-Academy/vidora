import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class HistoryService {
  private supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
  );

  async getHistoryByUserId(id: string) {
    const { data, error } = await this.supabase.rpc('get_watch_history', {
      p_user_id: id,
    });

    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return data;
  }

  async removeVideoFromHistory(videoId: string, userId: string) {
    const { data, error } = await this.supabase.from('history').delete().match({
      video_id: videoId,
      user_id: userId,
    });

    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return data;
  }

  async clearHistoryByUserId(id: string) {
    const { data, error } = await this.supabase.rpc('clear_user_history', {
      target_user_id: id,
    });

    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return data;
  }

  async searchHistoryByUserId(id: string, search: string) {
    const { data, error } = await this.supabase.rpc('search_history_by_date', {
      p_user_id: id,
      p_search_query: search,
    });

    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return data;
  }
}
