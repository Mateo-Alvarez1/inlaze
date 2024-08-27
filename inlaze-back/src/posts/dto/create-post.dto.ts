import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsInt()
  @Min(0)
  @IsOptional()
  likes: number;
  @IsDateString()
  @IsOptional()
  createdAt: String;
  @IsDateString()
  @IsOptional()
  updatedAt: String;
  @IsDateString()
  @IsOptional()
  deletedAt: String;
}
