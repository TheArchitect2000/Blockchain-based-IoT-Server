import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export interface SaveSubscriptionDTO {
  userId: string;
  token: string;
}

export class SetEmailSubscriptionBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  subscribe: boolean;
}