import { Injectable, Logger } from '@nestjs/common';
import { UserPermissionService } from '../user/services/user-permission/user-permission.service';
import { UserRoleService } from '../user/services/user-role/user-role.service';
import { UserService } from '../user/services/user/user.service';
import { BuildingService } from '../building/buildings/building.service';
import { RolesEnum } from '../user/enums/roles.enum';
import { UserActivationStatusEnum } from '../user/enums/user-activation-status.enum';
import { UserVerificationStatusEnum } from '../user/enums/user-verification-status.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly userPermissionService: UserPermissionService,
    private readonly userRoleService: UserRoleService,
    private readonly userService: UserService,
    private readonly buildingService: BuildingService,
  ) {}

  async seed() {
    this.logger.log('Starting database seeding...');

    try {
      // Step 1: Insert default permissions
      this.logger.log('Step 1: Inserting default permissions...');
      await this.userPermissionService.insertDefaultPermissions();
      this.logger.log('✓ Default permissions inserted successfully');

      // Step 2: Insert default roles (including ordinary role)
      this.logger.log('Step 2: Inserting default roles...');
      await this.userRoleService.insertDefaultRoles();
      this.logger.log('✓ Default roles inserted successfully');

      // Step 3: Create default admin user
      this.logger.log('Step 3: Creating default admin user...');
      await this.createDefaultAdminUser();
      this.logger.log('✓ Default admin user created successfully');

      this.logger.log('✅ Database seeding completed successfully!');
      return { success: true, message: 'Database seeded successfully' };
    } catch (error) {
      this.logger.error('❌ Error during database seeding:', error);
      throw error;
    }
  }

  private async createDefaultAdminUser() {
    const superAdminEmails = process.env.SUPER_ADMIN_EMAILS;

    if (!superAdminEmails) {
      this.logger.warn(
        '⚠️  SUPER_ADMIN_EMAILS not set in .env file. Skipping admin user creation.',
      );
      this.logger.warn(
        '   Please set SUPER_ADMIN_EMAILS in your .env file and run the seeder again.',
      );
      return;
    }

    // Parse the email array from env (format: ['email1@example.com','email2@example.com'])
    let emails: string[] = [];
    try {
      // Remove brackets and quotes, then split by comma
      const cleaned = superAdminEmails
        .replace(/[\[\]']/g, '')
        .replace(/\s/g, '');
      emails = cleaned.split(',').filter((email) => email.length > 0);
    } catch (error) {
      this.logger.error('Error parsing SUPER_ADMIN_EMAILS:', error);
      return;
    }

    if (emails.length === 0) {
      this.logger.warn(
        '⚠️  No valid emails found in SUPER_ADMIN_EMAILS. Skipping admin user creation.',
      );
      return;
    }

    // Use the first email as the default admin
    const adminEmail = emails[0].toLowerCase().trim();
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!';

    // Check if user already exists
    try {
      await this.userService.findAUserByEmail(adminEmail);
      const existingUser = (this.userService as any).user;
      if (existingUser) {
        this.logger.log(
          `ℹ️  User with email ${adminEmail} already exists. Skipping creation.`,
        );
        // Still try to make them admin if they're not already
        try {
          await this.userService.makeUserAdmin(adminEmail, ['super']);
          this.logger.log(`✓ User ${adminEmail} has been granted super_admin role.`);
        } catch (error) {
          this.logger.warn(
            `⚠️  Could not grant admin role to existing user: ${error.message}`,
          );
        }
        return;
      }
    } catch (error) {
      // User doesn't exist, continue with creation
    }

    // Get super_admin role
    const superAdminRole = await this.userRoleService.findARoleByShortName(
      'super',
    );

    if (!superAdminRole) {
      this.logger.error(
        '❌ Super admin role not found. Please run seeder again after roles are created.',
      );
      return;
    }

    try {
      // Use insertAUserByEmail method which handles role assignment properly
      const insertedUser = await this.userService.insertAUserByEmail({
        email: adminEmail,
        password: defaultPassword,
        StorX: {},
      });

      // Update user to add super_admin role and set status
      const userRepository = (this.userService as any).userRepository;
      if (userRepository && insertedUser) {
        // Get current roles and add super_admin
        const currentRoles = insertedUser.roles || [];
        const roleIds = currentRoles.map((r: any) =>
          typeof r === 'object' ? r._id : r,
        );
        
        // Add super_admin role if not already present
        if (!roleIds.includes(superAdminRole._id.toString())) {
          roleIds.push(superAdminRole._id);
        }

        await userRepository.editUser(insertedUser._id, {
          roles: roleIds,
          activationStatus: UserActivationStatusEnum.ACTIVE,
          verificationStatus: UserVerificationStatusEnum.VERIFIED,
        });
      }

      // Create default building for the user
      try {
        await this.buildingService.createDefaultBuilding(insertedUser._id);
        this.logger.log(`✓ Default building created for admin user.`);
      } catch (error) {
        this.logger.warn(
          `⚠️  Could not create default building: ${error.message}`,
        );
      }

      this.logger.log(
        `✓ Admin user created successfully with email: ${adminEmail}`,
      );
      this.logger.log(
        `  Default password: ${defaultPassword} (Please change this after first login!)`,
      );
    } catch (error) {
      this.logger.error(`❌ Error creating admin user: ${error.message}`);
      throw error;
    }
  }
}

