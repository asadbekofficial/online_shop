import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/entities/category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categotyRepo: Repository<Category>
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categotyRepo.create(createCategoryDto);
    return this.categotyRepo.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categotyRepo.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categotyRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  async update(id: number,updateCategoryDto: UpdateCategoryDto): Promise<{ message: string }> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    await this.categotyRepo.save(category);
    return { message: "Updated" };
  }

  async remove(id: number): Promise<{ message: string }> {
    const category = await this.findOne(id);
    await this.categotyRepo.remove(category);
    return { message: "Deleted" };
  }
}