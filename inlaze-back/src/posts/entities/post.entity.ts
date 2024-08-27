import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', {
    nullable: false,
  })
  title: string;
  @Column('text', {
    nullable: false,
  })
  content: string;

  @Column('int', {
    nullable: false,
    default: 0,
  })
  likes: number;
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

  @ManyToOne(() => User, (user) => user.post, { eager: true, cascade: true })
  user: User;
}
