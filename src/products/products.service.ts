import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService  {

  private readonly logger = new Logger('ProductService');
  
  constructor(private prisma: PrismaService) {
    this.logger.log('Database connected');
  }
  
  create(createProductDto: CreateProductDto) {
     return this.prisma.product.create({
    data: createProductDto
  });
  }

  async findAll( paginationDto : PaginationDto ) {
    
    const { page = 1, limit =10 } = paginationDto;

    const totalPage = await this.prisma.product.count( );

    const lastPage = Math.ceil( totalPage / limit );
    return {
      data  : await this.prisma.product.findMany({
      skip  : (page -1) * limit,
      take  : limit,
      where : {available : true},
    }),
    meta : {
      total    : totalPage,
      page     : page,
      lastPage : lastPage,
    }
    }
  }

  async findOne(id: number) {
    
    const product =  await this.prisma.product.findUnique({ where:{id , available : true} })

    if(!product)
    {
      throw new NotFoundException(`Product with ID:${id} not found`);
    }
    
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    
    await this.findOne(id);
    
    return this.prisma.product.update({
      where: {id},
      data : updateProductDto,
    })
  }

  async remove(id: number) {
    await this.findOne(id);

    // return this.prisma.product.delete({
    //   where: {id}
    // });
    
    const product = this.prisma.product.update({
      where: { id },
      data: { 
        available: false 
      }
    });
   
    return product;
  }
}
