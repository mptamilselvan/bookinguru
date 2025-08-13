import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { ExternalApiService } from './external-api.service';

@Module({
  imports: [],
  controllers: [AppController, CitiesController],
  providers: [AppService, CitiesService, ExternalApiService],
})
export class AppModule { }
