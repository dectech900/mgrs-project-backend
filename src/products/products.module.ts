import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductsSchema } from './schemas/products.schema';
import { ProductCategory, ProductCategorySchema } from './schemas/category.schema';
import { Favorite, FavoriteSchema } from './schemas/favourite.schema';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as multer from 'multer'
import { Config } from '../config/config';
import { AddProductToCart, AddProductToCartSchema } from './schemas/add-to-cart.schema';

export const storage = (folderName: string): any => {
  return multer.diskStorage({
    destination: function (req: Request, file, cb) {
      cb(null, folderName);
    } as any,
    filename: function (req, file, cb) {
      const uniqueSuffix = `photo-${
        (req as any)?.user?.email ?? ''
      }-${new Date().toISOString().replace(/:/g, '-')}-${Math.round(
        Math.random() * 1e9,
      )}`;
      cb(null, `${uniqueSuffix}.${file.mimetype.split('/').pop()}`);
    },
  });
};
@Module({
  imports:[
    MongooseModule.forFeature([
      {name: Products.name, schema: ProductsSchema},
      {name: ProductCategory.name, schema: ProductCategorySchema},
      {name: Favorite.name, schema: FavoriteSchema},
      {name: AddProductToCart.name, schema: AddProductToCartSchema},

    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>({
        storage: storage(configService.get('PRODUCTS_IAMGE_UPLOADS') + '/products')
      }),
      inject: [ConfigService]
    })
  ],
  providers: [ProductsService, Config],
  controllers: [ProductsController]
})
export class ProductsModule {}
