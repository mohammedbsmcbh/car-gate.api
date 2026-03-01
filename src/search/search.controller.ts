import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { SearchService } from './search.service';
import { SearchListingsDto, SearchQueryDto, NearbySearchDto } from './dto';

@Public()
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('listings')
  async searchListings(@Query() dto: SearchListingsDto) {
    const { q, page = 1, limit = 20, ...filters } = dto;
    return this.searchService.searchListings(q || '', filters, page, limit);
  }

  @Get('agencies')
  async searchAgencies(@Query() dto: SearchQueryDto) {
    console.log('Search Agencies DTO:', dto);
    const { q = '', page = 1, limit = 20 } = dto;
    return this.searchService.searchAgencies(q, page, limit);
  }

  @Get('showrooms')
  async searchShowrooms(@Query() dto: SearchQueryDto) {
    const { q = '', page = 1, limit = 20 } = dto;
    return this.searchService.searchShowrooms(q, page, limit);
  }

  @Get('global')
  async globalSearch(@Query() dto: SearchQueryDto) {
    const { q = '', page = 1, limit = 10 } = dto;
    return this.searchService.globalSearch(q, page, limit);
  }

  @Get('nearby')
  async searchNearby(@Query() dto: NearbySearchDto) {
    const { latitude, longitude, radiusKm = 10, page = 1, limit = 20 } = dto;
    return this.searchService.searchNearby(latitude, longitude, radiusKm, page, limit);
  }
}
