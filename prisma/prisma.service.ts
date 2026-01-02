import { Injectable } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';





import { envs } from 'src/config';
import { PrismaClient } from 'src/generated/prisma/client';

const databaseUrl = envs.databaseURL?.replace('file:', '') || './dev.db';


@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
    super({ adapter });
  }
}
