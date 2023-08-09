import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TerminusModule, HttpModule, AuthModule],
  controllers: [HealthController],
})
export class HealthModule {}
