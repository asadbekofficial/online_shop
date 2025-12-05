import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../entities/products.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Category } from "../entities/category.entity";
import { Auth } from "../entities/auth.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,

    @InjectRepository(Auth)
    private authRepo: Repository<Auth>
  ) {}

  async create(dto: CreateProductDto) {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) throw new NotFoundException("Category not found");

    const createdBy = await this.authRepo.findOne({
      where: { id: dto.createdBy },
    });
    if (!createdBy) throw new NotFoundException("User not found");

    const product = this.productRepo.create({
      ...dto,
      category,
      createdBy,
    });

    return this.productRepo.save(product);
  }

  findAll() {
    return this.productRepo.find({
      relations: ["category", "createdBy"],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ["category", "createdBy"],
    });

    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) throw new NotFoundException("Category not found");
      product.category = category;
    }

    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productRepo.remove(product);
  }
}
