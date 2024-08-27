import { Post } from 'src/posts/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', {
    nullable: false,
  })
  fullname: string;
  @Column('int', {
    nullable: false,
  })
  age: number;
  @Column('text', {
    unique: true,
    nullable: false,
  })
  email: string;
  @Column('text', {
    nullable: false,
  })
  password: string;
  @Column('date', {
    nullable: true,
    default: new Date(),
  })
  createdAt: Date;
  @Column('date', {
    nullable: true,
  })
  updatedAt: Date;
  @Column('date', {
    nullable: true,
  })
  deletedAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  post: Post;
}
