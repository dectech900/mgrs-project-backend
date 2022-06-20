import {
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';
import { IJWTResponse, IPaginate, IUploadFile } from 'src/types/types';
import { Paginate } from '../utils/helpers';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ProductCategory,
  ProductCategoryDocument,
} from './schemas/category.schema';
import { Favorite, FavoriteDocument } from './schemas/favourite.schema';
import { Products, ProductsDocument } from './schemas/products.schema';
import { v2 } from 'cloudinary';
import { Config } from '../config/config';
import fs from 'fs';
import {
  AddProductToCart,
  AddProductToCartDocument,
} from './schemas/add-to-cart.schema';
import { AddProductToCartDto, UpdateCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectModel(Products.name)
    private readonly productsModel: Model<ProductsDocument>,
    @InjectModel(ProductCategory.name)
    private readonly productsCategoryModel: Model<ProductCategoryDocument>,
    @InjectModel(Favorite.name)
    private readonly favoriteModel: Model<FavoriteDocument>,
    @InjectModel(AddProductToCart.name)
    private readonly addToCartModel: Model<AddProductToCartDocument>,
    private readonly config: Config,
  ) {}

  async createCategory(body: CreateCategoryDto): Promise<any> {
    try {
      return await this.productsCategoryModel.create({
        name: body?.name,
        slug: slugify(body?.name),
        description: body?.description,
      });
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  async getCategory(): Promise<any> {
    try {
      return await this.productsCategoryModel.find({}).exec();
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  async deleteCategory(user: IJWTResponse, category): Promise<any> {
    try {
      return await this.productsCategoryModel
        .deleteOne({ _id: category })
        .exec();
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  async updateCategory(
    user: IJWTResponse,
    category: string,
    body: UpdateCategoryDto,
  ): Promise<any> {
    try {
      const { description, name } = body;
      return await this.productsCategoryModel
        .findOneAndUpdate(
          { _id: category },
          {
            name,
            description,
          },
          { new: true },
        )
        .exec();
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  //ADD PRODUCT SESSION
  async addProduct(body: CreateProductDto, files: IUploadFile[]): Promise<any> {
    try {
      const {
        category,
        images,
        old_price,
        product_name,
        quantity,
        colors,
        description,
        new_price,
        short_description,
        sizes,
        banner,
        featured,
      } = body;

      v2.config({
        cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
        api_key: this.config.get('CLOUDINARY_API_KEY'),
        api_secret: this.config.get('CLOUDINARY_API_SECRET'),
      });

      const percent =
        ((Number(new_price) - Number(old_price)) / Number(old_price)) * 100;

      console.log('percent', Math.ceil(percent));
      if (files[0]) {
        console.log('files[0]?.path', files[0]?.path);
        // fs.unlinkSync(files[0]?.path)
      }

      // return cloudImage
      let cloudImage = null;
      let urls = [];
      const uploadProduct = await Promise.all([
        (cloudImage = await v2.uploader.upload(
          files[0].path,
          { folder: 'test' },
          async (error, result) => {
            if (result) {
              urls.push(result);
              return result;

              // console.log('results', result)
            }
            if (error) {
              // console.log('results', error)
              this.logger.error(error);
            }
          },
        )),
        // cloudImage = files.map(async(file) => {
        //   console.log('file', file)
        //   await v2.uploader.upload(file?.path, {folder: 'test2'}, ((err, res) => {
        //     if(res){
        //       urls.push(res)
        //       return res
        //     }
        //   }))
        // }),
        await this.productsModel.create({
          product_name: product_name,
          slug: slugify(product_name),
          old_price,
          new_price,
          quantity,
          percent: Math.ceil(percent),
          short_description,
          category,
          description,
          sizes,
          images: { url: cloudImage?.url, public_id: cloudImage?.public_id },
          colors,
          featured,
          banner,
        }),
      ]);
      // console.log('urls', urls);
      // console.log('cloudImage', cloudImage);
      return uploadProduct;

      //   return await this.productsModel.create({
      //     product_name: product_name,
      //     slug: slugify(product_name),
      //     old_price,
      //     new_price,
      //     quantity,
      //     short_description,
      //     category,
      //     description,
      //     sizes,
      //     // images,
      //     colors,
      //   });
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  async getProductByCategory(
    isPaginated: string,
    size: number,
    page: number,
    category: string,
    query: string,
  ): Promise<IPaginate<Products> | Products[]> {
    try {
      const searchQuery = query ? RegExp(query, 'i') : null;
      const productCategory = category ? category : null;

      console.log('category', category);
      console.log('searchQuery', searchQuery);

      if (isPaginated && JSON.parse(isPaginated)) {
        if (searchQuery === null && productCategory === null) {
          const [totalItems, count] = await Promise.all([
            await this.productsModel
              .find({})
              .populate({
                path: 'category',
                select: 'name',
              })
              .exec(),
            await this.productsModel
              .find({ category: category })
              .countDocuments()
              .exec(),
          ]);
          return Paginate<Products>(totalItems, count, {
            page,
            size,
            url: `${this.config.get('app.client_base_url')}/products`,
          });
        } else if (searchQuery) {
          const [totalItems, count] = await Promise.all([
            await this.productsModel
              .find({
                $or: [{ product_name: searchQuery }, { slug: searchQuery }],
              })
              .populate({
                path: 'category',
                select: 'name',
              })
              .exec(),
            await this.productsModel
              .find({ category: category })
              .countDocuments()
              .exec(),
          ]);
          return Paginate<Products>(totalItems, count, {
            page,
            size,
            url: `${this.config.get('app.client_base_url')}/products`,
          });
        } else if (productCategory) {
          const [totalItems, count] = await Promise.all([
            await this.productsModel
              .find({ category: category })
              .populate({
                path: 'category',
                select: 'name',
              })
              .exec(),
            await this.productsModel
              .find({ category: category })
              .countDocuments()
              .exec(),
          ]);
          return Paginate<Products>(totalItems, count, {
            page,
            size,
            url: `${this.config.get('app.client_base_url')}/products`,
          });
        }
      } else {
        return await this.productsModel
          .find({ category: category })
          .populate({ path: 'category', select: 'name' })
          .exec();
      }
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  async getFeaturedProduct(
    featured: boolean,
  ): Promise<IPaginate<Products> | Products[]> {
    try {
      return await this.productsModel
        .find({ featured: featured })
        .populate({
          path: 'category',
          select: 'name',
        })
        .exec();
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  async getProductCat(
    category: string,
  ): Promise<IPaginate<Products> | Products[]> {
    try {
      const cateQuery = new RegExp(category, 'i');
      console.log('cateQuery', category);
      return await this.productsModel.aggregate([
        {
          $lookup: {
            from: 'productcategories',
            localField: 'category',
            foreignField: '_id',
            as: 'productCategory',
          },
        },
        {
          $match: {
            'productCategory.name': cateQuery,
          },
        },
        { $limit: Number(5) },
      ]);
      //  .find({category: category})
      //  .populate({
      //    path: 'category',
      //    select: 'name',
      //  })
      //  .exec()
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  async updateProduct(
    user: IJWTResponse,
    product: string,
    body: UpdateProductDto,
  ): Promise<any> {
    try {
      const {
        category,
        images,
        old_price,
        product_name,
        quantity,
        banner,
        colors,
        description,
        featured,
        new_price,
        short_description,
        sizes,
      } = body;

      const percent =
        ((Number(new_price) - Number(old_price)) / Number(old_price)) * 100;

      return await this.productsModel
        .findOneAndUpdate(
          { _id: product },
          {
            product_name: product_name,
            slug: slugify(product_name),
            old_price,
            new_price,
            quantity,
            percent: Math.ceil(percent),
            short_description,
            category,
            description,
            sizes,
            // images: { url: cloudImage?.url, public_id: cloudImage?.public_id },
            colors,
            featured,
            banner,
          },
          { new: true },
        )
        .exec();
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  //GET PRODUCT AS FAVORITE BY USER
  async getFavorite(user: IJWTResponse): Promise<Favorite[]> {
    try {
      if (user) {
        return await this.favoriteModel
          .find({ user_id: user?.sub })
          .populate({
            path: 'product_id',
          })
          .exec();
      }
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  //REMOVE PRODUCT AS FAVORITE BY USER
  async removeProductAsFavorite(
    user: IJWTResponse,
    favorite: string,
  ): Promise<any> {
    try {
      if (user) {
        return await this.favoriteModel.deleteOne({ _id: favorite });
      }
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }
  //ADD PRODUCT AS FAVORITE BY USER
  async addProductAsFavorite(
    user: IJWTResponse,
    product: string,
  ): Promise<any> {
    try {
      if (user) {
        const favExit = await this.favoriteModel
          .exists({ product_id: product })
          .exec();
        if (favExit) {
          throw new HttpException('Product already added as favourite', 400);
        }
        return await this.favoriteModel.create({
          user_id: user?.sub,
          product_id: product,
        });
      }
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  //ADD PRODUCTS TO CART
  async getCart(user: IJWTResponse): Promise<any> {
    try {
      if (user) {
        const cartProduct = await this.addToCartModel.find({}).populate({
          path: 'product_id'
        }).exec();
        // reduce((a, b) => a + b, 0)
       const cartGrandTotal =  cartProduct?.map((product) => {
          return product?.sub_total
        })
        console.log('cartGrandTotal', cartGrandTotal.reduce((a, b) => a + b, 0))
       return {
         cartItems: cartProduct,
         grandTotal: cartGrandTotal.reduce((a, b) => a + b, 0)
       }
      } else {
        throw new UnauthorizedException('Make sure you have the right access');
      }
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  //ADD PRODUCTS TO CART
  async addProductToCart(
    user: IJWTResponse,
    body: AddProductToCartDto,
  ): Promise<any> {
    try {
      const { color, grand_total, product_id, quantity, size, sub_total } =
        body;
      if (user) {
        const product = await this.productsModel.findOne({
          _id: product_id,
        });
        console.log('product_id', product_id)
        const productExist = await this.addToCartModel.exists({
          product_id: product_id,
        });
        if (productExist) {
          //update quantity
          throw new HttpException('Product already added to cart', 400);
        } else {
          //create new
        //  const total = Number(product?.new_price) * Number(quantity)
        //   console.log('total', total)
        //   console.log('Number(product?.new_price)', Number(product?.new_price))
        //   console.log('Number(quantity', Number(quantity))
        //   console.log('product', product)

          return await this.addToCartModel.create({
            color,
            product_id,
            quantity,
            size,
            price: product?.new_price,
            sub_total: Number(product?.new_price) * Number(quantity),
            user_id: user?.sub,
          });
        }
      } else {
        throw new UnauthorizedException('Make sure you have the right access');
      }
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  //ADD PRODUCTS TO CART
  async updateProductToCart(
    user: IJWTResponse,
    body: UpdateCartDto,
    product_id: string,
    cart_id: string,
  ): Promise<any> {
    try {
      const { color, quantity, size } = body;
   
      if (user) {
        const product = await this.productsModel.findOne({
          _id: product_id,
        });

        const cart = await this.addToCartModel.findOne({ _id: cart_id }).exec();

        if(quantity){
          return await this.addToCartModel.findOneAndUpdate(
            { _id: cart_id },
            
            {
             
              quantity: quantity,
              price: product?.new_price,
              sub_total: Number(quantity) * Number(product?.new_price)
             
            },
          );
        }

        if(size){
          return  await this.addToCartModel.findOneAndUpdate(
            { _id: cart_id },
            {
              size: size,
              price: product?.new_price,
            },
          );
          // console.log('sizeUpdated', sizeUpdated)
        }
        console.log('color', color)
        if(color){
          return await this.addToCartModel.findOneAndUpdate(
            { _id: cart_id },
            {
              color: color,
              price: product?.new_price,
            },
          );
        }

      } else {
        throw new UnauthorizedException('Make sure you have the right access');
      }
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  //ADD PRODUCTS TO CART
  async removeCart(user: IJWTResponse, product_id: string): Promise<any> {
    try {
      if (user) {
        return this.addToCartModel.findOneAndRemove({
          product_id: product_id,
        });
      } else {
        throw new UnauthorizedException('Make sure you have the right access');
      }
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }
}
