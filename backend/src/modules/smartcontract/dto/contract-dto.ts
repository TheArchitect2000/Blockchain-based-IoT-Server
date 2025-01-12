import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class verifyProofDto {
  @IsNotEmpty({ message: 'proof is required and must be entered.' })
  @IsString({ message: 'proof must be string.' })
  @ApiProperty({ required: true })
  proof: string;
}

export interface StoreCommitmentData {
  frontPublish: boolean;
  commitmentID: string;
  userId: string;
  manufacturerName: string;
  deviceName: string;
  hardwareVersion: string;
  firmwareVersion: string;
  commitmentData: string;
  createdAt?: Date;
}

export class storeCommitmentDto {
  @IsNotEmpty({ message: 'frontPublish is required and must be entered.' })
  @IsString({ message: 'frontPublish must be string.' })
  @ApiProperty({ required: true })
  frontPublish: boolean;

  @IsNotEmpty({ message: 'commitmentID is required and must be entered.' })
  @IsString({ message: 'commitmentID must be string.' })
  @ApiProperty({ required: true })
  commitmentID: string;

  @IsNotEmpty({ message: 'manufacturerName is required and must be entered.' })
  @IsString({ message: 'manufacturerName must be string.' })
  @ApiProperty({ required: true })
  manufacturerName: string;

  @IsNotEmpty({ message: 'deviceName is required and must be entered.' })
  @IsString({ message: 'deviceName must be string.' })
  @ApiProperty({ required: true })
  deviceName: string;

  @IsNotEmpty({
    message: 'hardwareVersion is required and must be entered.',
  })
  @IsString({ message: 'hardwareVersion must be string.' })
  @ApiProperty({ required: true })
  hardwareVersion: string;

  @IsNotEmpty({ message: 'firmwareVersion is required and must be entered.' })
  @IsString({ message: 'firmwareVersion must be string.' })
  @ApiProperty({ required: true })
  firmwareVersion: string;

  @IsNotEmpty({ message: 'commitmentData is required and must be entered.' })
  @IsString({ message: 'commitmentData must be string.' })
  @ApiProperty({ required: true })
  commitmentData: string;
}

export class removeCommitmentDto {
  @IsNotEmpty({ message: 'commitmentId is required and must be entered.' })
  @IsString({ message: 'commitmentId must be string.' })
  @ApiProperty({ required: true })
  commitmentId: string;

  @IsNotEmpty({ message: 'dbId is required and must be entered.' })
  @IsString({ message: 'dbId must be string.' })
  @ApiProperty({ required: true })
  dbId: string;

  @IsNotEmpty({ message: 'nodeId is required and must be entered.' })
  @IsString({ message: 'nodeId must be string.' })
  @ApiProperty({ required: true })
  nodeId: string;
}

export class publishProofDto {
  @IsNotEmpty({ message: 'frontPublish is required and must be entered.' })
  @IsString({ message: 'frontPublish must be string.' })
  @ApiProperty({ required: true })
  frontPublish: boolean;

  @IsNotEmpty({ message: 'deviceType is required and must be entered.' })
  @IsString({ message: 'deviceType must be string.' })
  @ApiProperty({ required: true })
  deviceType: string;

  @IsNotEmpty({ message: 'proof is required and must be entered.' })
  @IsString({ message: 'proof must be string.' })
  @ApiProperty({ required: true })
  proof: string;

  @IsNotEmpty({ message: 'data is required and must be entered.' })
  @IsString({ message: 'data must be string.' })
  @ApiProperty({ required: true })
  data: Record<string, string>;
}

export class walletBalanceDto {
  @IsNotEmpty({ message: 'walletAddress is required and must be entered.' })
  @IsString({ message: 'walletAddress must be string.' })
  @ApiProperty({ required: true })
  walletAddress: string;
}

export class removeServiceDto {
  @IsNotEmpty({ message: 'proof is required and must be entered.' })
  @IsString({ message: 'proof must be string.' })
  @ApiProperty({ required: true })
  nodeId: string;

  @IsNotEmpty({ message: 'proof is required and must be entered.' })
  @IsString({ message: 'proof must be string.' })
  @ApiProperty({ required: true })
  serviceId: string;
}

export class removeDeviceDto {
  @IsNotEmpty({ message: 'proof is required and must be entered.' })
  @IsString({ message: 'proof must be string.' })
  @ApiProperty({ required: true })
  nodeId: string;

  @IsNotEmpty({ message: 'proof is required and must be entered.' })
  @IsString({ message: 'proof must be string.' })
  @ApiProperty({ required: true })
  deviceId: string;
}
