import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class verifyProofDto {
  @IsNotEmpty({ message: 'proof is required and must be entered.' })
  @IsString({ message: 'proof must be string.' })
  @ApiProperty({ required: true })
  proof: string;
}

export class storeCommitmentDto {
  @IsNotEmpty({ message: 'manufacturerName is required and must be entered.' })
  @IsString({ message: 'manufacturerName must be string.' })
  @ApiProperty({ required: true })
  manufacturerName: string;

  @IsNotEmpty({ message: 'deviceType is required and must be entered.' })
  @IsString({ message: 'deviceType must be string.' })
  @ApiProperty({ required: true })
  deviceType: string;

  @IsNotEmpty({ message: 'deviceHardwareVersion is required and must be entered.' })
  @IsString({ message: 'deviceHardwareVersion must be string.' })
  @ApiProperty({ required: true })
  deviceHardwareVersion: string;

  @IsNotEmpty({ message: 'firmwareVersion is required and must be entered.' })
  @IsString({ message: 'firmwareVersion must be string.' })
  @ApiProperty({ required: true })
  firmwareVersion: string;

  @IsNotEmpty({ message: 'lines is required and must be entered.' })
  @IsString({ message: 'lines must be string.' })
  @ApiProperty({ required: true })
  lines: string;

  @IsNotEmpty({ message: 'commitmentData is required and must be entered.' })
  @IsString({ message: 'commitmentData must be string.' })
  @ApiProperty({ required: true })
  commitmentData: string;
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
