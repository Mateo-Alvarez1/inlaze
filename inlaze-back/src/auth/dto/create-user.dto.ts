import {
  IsDate,
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  fullname: string;
  @IsInt()
  @Min(18)
  age: number;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
  @IsDateString()
  @IsOptional()
  createdAt: string;
  @IsDateString()
  @IsOptional()
  updatedAt: string;
  @IsDateString()
  @IsOptional()
  deletedAt: string;
}
