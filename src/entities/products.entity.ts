import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { Category } from "../entities/category.entity";
import { Auth } from "../entities/auth.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  oldPrice?: number;

  @Column()
  discountPrice?: number;

  @Column()
  stock: number;

 @Column("text", { array: true, nullable: true })
 images?: string[];

 @Column("text", { array: true, nullable: true })
 colors?: string[];

  @Column({ type: 'json', nullable: true })
  specifications?: Record<string, any>;

  @Column({ type: "float", default: 0 })
  rating: number;

  @Column({ default: false })
  isFeatured: boolean;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToOne(() => Auth, { eager: true })
  createdBy: Auth;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}