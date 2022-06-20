import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { IJWTResponse, IPaginate, IUploadFile } from '../types/types';
import { AddProductToCartDto, UpdateCartDto } from './dto/add-to-cart.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Favorite } from './schemas/favourite.schema';
import { Products } from './schemas/products.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post('/category')
  async createCategory(
    @Body(new ValidationPipe({ transform: true })) body: CreateCategoryDto,
  ): Promise<any> {
    return await this.productService.createCategory(body);
  }

  @Get('/category')
  async getCategory(): Promise<any> {
    return await this.productService.getCategory();
  }
  @Delete('/category/:category')
  async deleteCategory(
    @Param('category') category: string,
    @User() user: IJWTResponse,
  ): Promise<any> {
    return await this.productService.deleteCategory(user, category);
  }
  @Put('/category/:category')
  async updateCategory(
    @Param('category') category: string,
    @User() user: IJWTResponse,
    @Body(new ValidationPipe({ transform: true })) body: UpdateCategoryDto,
  ): Promise<any> {
    return await this.productService.updateCategory(user, category, body);
  }

  @Get('/favorites')
  @UseGuards(JwtAuthGuard)
  async getFavorite(@User() user: IJWTResponse): Promise<Favorite[]> {
    return await this.productService.getFavorite(user);
  }

  @Post('/favorites/:product')
  @UseGuards(JwtAuthGuard)
  async addProductAsFavorite(
    @User() user: IJWTResponse,
    @Param('product') product: string,
  ): Promise<Favorite> {
    return await this.productService.addProductAsFavorite(user, product);
  }

  @Delete('/favorites/:favorite')
  @UseGuards(JwtAuthGuard)
  async removeProductAsFavorite(
    @Param('favorite') favorite: string,
    @User() user: IJWTResponse,
  ): Promise<any> {
    return await this.productService.removeProductAsFavorite(user, favorite);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async addProduct(
   @UploadedFiles() files: IUploadFile[],
    @Body(new ValidationPipe({ transform: true })) body: CreateProductDto,
  ): Promise<any> {
    return await this.productService.addProduct(body, files);
  }

  @Put('/:product')
  async updateProduct(
    @Param('product') product: string,
    @User() user: IJWTResponse,
    @Body(new ValidationPipe({ transform: true })) body: UpdateProductDto,
  ): Promise<any> {
    return await this.productService.updateProduct(user, product, body);
  }
  
  @Get('')
  async getProductByCategory(
    @Query('isPaginated') isPaginated: string,
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('category') category: string,
    @Query('search') search: string,
  ): Promise<IPaginate<Products> | Products[]> {
    return await this.productService.getProductByCategory(
      isPaginated,
      size,
      page,
      category,
      search,
    );
  }

  @Get('/featured')
  async getFeaturedProduct(
    @Query('featured') featured: boolean,
  ): Promise<IPaginate<Products> | Products[]> {
    return await this.productService.getFeaturedProduct(featured)
  }

  @Get('/get-product-by-category/:category')
  async getProductCat(
    @Param('category') category: string,
  ): Promise<IPaginate<Products> | Products[]> {
    return await this.productService.getProductCat(category)
  }

  //Cart
  @Get('/cart')
  @UseGuards(JwtAuthGuard)
 async getCart(
   @User() user: IJWTResponse
  ):Promise<any> {
   return this.productService.getCart(user)
 }
  @Post('/cart/add')
  @UseGuards(JwtAuthGuard)
 async addProductToCart(
   @Body(new ValidationPipe({transform: true})) body: AddProductToCartDto,
   @User() user: IJWTResponse
  ):Promise<any> {
   return this.productService.addProductToCart(user, body)
 }

  @Put('/cart/update/:cart_id/:product_id')
  @UseGuards(JwtAuthGuard)
 async updateProductToCart(
   @Param('cart_id') cart_id: string,
   @Param('product_id') product_id: string,
   @Body(new ValidationPipe({transform: true})) body: UpdateCartDto,
   @User() user: IJWTResponse
  ):Promise<any> {
   return this.productService.updateProductToCart(user,body,product_id,cart_id)
 }

  @Delete('/cart/remove/:product_id')
  @UseGuards(JwtAuthGuard)
 async removeCart(
   @Param('product_id') product_id: string,
   @User() user: IJWTResponse
  ):Promise<any> {
   return this.productService.removeCart(user, product_id)
 }

}
