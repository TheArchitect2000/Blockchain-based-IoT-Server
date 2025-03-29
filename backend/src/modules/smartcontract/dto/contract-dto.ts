import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class verifyProofDto {
  @IsNotEmpty({ message: 'proof is required and must be entered.' })
  @IsString({ message: 'proof must be string.' })
  @ApiProperty({ required: true })
  proof: string;
}

export interface StoreCommitmentData {
  frontPublish: boolean;
  transactionId?: string;
  commitmentID: string;
  userId: string;
  manufacturer: string;
  deviceType: string;
  deviceIdType: string;
  deviceModel: string;
  softwareVersion: string;
  commitmentData: string;
}

export class storeCommitmentDto {
  @IsString({ message: 'transactionId must be string.' })
  @ApiProperty({ required: false })
  transactionId: string;

  @IsNotEmpty({ message: 'frontPublish is required and must be entered.' })
  @IsString({ message: 'frontPublish must be string.' })
  @ApiProperty({ required: true })
  frontPublish: boolean;

  @IsNotEmpty({ message: 'commitmentID is required and must be entered.' })
  @IsString({ message: 'commitmentID must be string.' })
  @ApiProperty({ required: true })
  commitmentID: string;

  @IsNotEmpty({ message: 'deviceType is required and must be entered.' })
  @IsString({ message: 'deviceType must be string.' })
  @ApiProperty({ required: true })
  deviceType: string;

  @IsNotEmpty({ message: 'deviceIdType is required and must be entered.' })
  @IsString({ message: 'deviceIdType must be string.' })
  @ApiProperty({ required: true })
  deviceIdType: string;

  @IsNotEmpty({
    message: 'deviceModel is required and must be entered.',
  })
  @IsString({ message: 'deviceModel must be string.' })
  @ApiProperty({ required: true })
  deviceModel: string;

  @IsNotEmpty({ message: 'manufacturer is required and must be entered.' })
  @IsString({ message: 'manufacturer must be string.' })
  @ApiProperty({ required: true })
  manufacturer: string;

  @IsNotEmpty({ message: 'softwareVersion is required and must be entered.' })
  @IsString({ message: 'softwareVersion must be string.' })
  @ApiProperty({ required: true })
  softwareVersion: string;

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

export class RequestFaucetDto {
  @ApiProperty({ required: true })
  @IsIn(['identity', 'ownership'], {
    message: 'Type must be either "identity" or "ownership"',
  })
  type: 'identity' | 'ownership'

  @IsString({ message: 'ownerShipWalletAddress must be string.' })
  @ApiProperty({ required: false })
  ownerShipWalletAddress: string;
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
