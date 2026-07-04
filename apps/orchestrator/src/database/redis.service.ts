import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    const redisAddr = process.env.REDIS_ADDR || '127.0.0.1:6379';
    let redisHost = '127.0.0.1';
    let redisPort = 6379;

    if (redisAddr.includes(':')) {
      const parts = redisAddr.split(':');
      redisHost = parts[0];
      redisPort = parseInt(parts[1], 10);
    } else {
      redisHost = redisAddr;
    }

    this.client = new Redis({
      host: redisHost,
      port: redisPort,
      maxRetriesPerRequest: 3,
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, expirySeconds?: number): Promise<string> {
    if (expirySeconds) {
      return this.client.set(key, value, 'EX', expirySeconds);
    }
    return this.client.set(key, value);
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    return this.client.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
