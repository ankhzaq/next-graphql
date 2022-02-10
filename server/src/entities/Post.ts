import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './User';
import { Updoot } from './Updoot';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null; // 1 or -1 or null

  @Field()
  @Column()
  creatorId: number;

  @Field()
  @ManyToOne(type => User, user => user.posts)
  creator: User;

  @OneToMany(() => Updoot, updoot => updoot.post)
  updoots: Updoot[]

  @Field((() => String))
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

}
