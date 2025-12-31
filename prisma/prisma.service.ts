import { Injectable } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';


import { PrismaClient } from '@prisma/client';

import { envs } from 'src/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaBetterSqlite3({ url: envs.databaseURL });
    super({ adapter });
  }
}
