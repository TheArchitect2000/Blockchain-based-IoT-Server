import { Injectable } from '@nestjs/common';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { RoleDepartmentsEnum } from '../../enums/role-departments.enum';
import { UserRoleRepository } from '../../repositories/user-role.repository';
import { UserPermissionService } from '../user-permission/user-permission.service';
import { RoleActivationStatusEnum } from '../../enums/role-activation-status.enum';

// This should be a real class/interface representing a user entity
export type UserRole = any;

@Injectable()
export class UserRoleService {
  private result;
  public defaultRoles = [
    {
      short: 'super',
      roleName: 'super_admin',
      roleLabel: 'main_admin',
      permissionName: 'full_controll',
      roleDepartment: RoleDepartmentsEnum.ADMINS,
    },
    {
      short: 'user',
      roleName: 'user_admin',
      roleLabel: 'regular_admin',
      permissionName: 'users',
      roleDepartment: RoleDepartmentsEnum.ADMINS,
    },
    {
      short: 'device',
      roleName: 'device_admin',
      roleLabel: 'regular_admin',
      permissionName: 'devices',
      roleDepartment: RoleDepartmentsEnum.ADMINS,
    },
    {
      short: 'service',
      roleName: 'service_admin',
      roleLabel: 'regular_admin',
      permissionName: 'services',
      roleDepartment: RoleDepartmentsEnum.ADMINS,
    },
    {
      short: 'request',
      roleName: 'request_admin',
      roleLabel: 'regular_admin',
      permissionName: 'requests',
      roleDepartment: RoleDepartmentsEnum.ADMINS,
    },
    {
      short: 'notification',
      roleName: 'notification_admin',
      roleLabel: 'regular_admin',
      permissionName: 'notifications',
      roleDepartment: RoleDepartmentsEnum.ADMINS,
    },
    {
      short: 'cm_developer',
      roleName: 'company_developer',
      roleLabel: 'company_developer',
      permissionName: 'cm_developer',
      roleDepartment: RoleDepartmentsEnum.DEVELOPMENT,
    },
    {
      short: 'cmd_a',
      roleName: 'company_developer_a',
      roleLabel: 'company_developer_a',
      permissionName: 'cmd_a',
      roleDepartment: RoleDepartmentsEnum.DEVELOPMENT,
    },
    {
      short: 'cmd_b',
      roleName: 'company_developer_b',
      roleLabel: 'company_developer_b',
      permissionName: 'cmd_b',
      roleDepartment: RoleDepartmentsEnum.DEVELOPMENT,
    },
    {
      short: 'cmd_c',
      roleName: 'company_developer_c',
      roleLabel: 'company_developer_c',
      permissionName: 'cmd_c',
      roleDepartment: RoleDepartmentsEnum.DEVELOPMENT,
    },
    {
      short: 'normal',
      roleName: 'ordinary',
      roleLabel: 'ordinary_user',
      permissionName: 'read_content',
      roleDepartment: RoleDepartmentsEnum.USERS,
    },
  ];

  constructor(
    private readonly userRoleRepository?: UserRoleRepository,
    private readonly userPermissionService?: UserPermissionService,
  ) {}

  async insertDefaultRoles(): Promise<any> {
    for (const role of this.defaultRoles) {
      try {
        if (!(await this.roleExists(role.roleName))) {
          let permissions: string[] = [];
          let fullControllPermission = await this.userPermissionService
            .findAPermissionByName(role.permissionName)
            .catch((error) => {
              let errorMessage =
                'Some errors occurred while finding user permission!';
              throw new GeneralException(
                ErrorTypeEnum.UNPROCESSABLE_ENTITY,
                errorMessage,
              );
            });

          permissions.push(fullControllPermission._id);

          let newRole = {
            name: role.roleName,
            department: role.roleDepartment,
            label: role.roleLabel,
            deletable: false,
            permissions: permissions,
            activationStatus: RoleActivationStatusEnum.ACTIVATED,
            insertDate: new Date(),
            updateDate: new Date(),
          };

          await this.userRoleRepository.insertRole(newRole).then((data) => {
            this.result = data;
          });
        }
      } catch (error) {
        let errorMessage = 'Some errors occurred while inserting a admin user!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      }
    }

    return this.result;
  }

  async roleExists(roleName): Promise<Boolean> {
    let foundRole: any;
    await this.findARoleByName(roleName)
      .then((data) => {
        foundRole = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a user!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    if (foundRole) return true;
    else return false;
  }

  async insertRoleByPanel(data, userId): Promise<any> {
    let newRole = {
      department: data.department,
      name: data.name,
      label: data.label,
      description: data.description,
      deletable: data.deletable,
      permissions: data.permissions,
      insertedBy: userId,
      insertDate: new Date(),
      updatedBy: userId,
      updateDate: new Date(),
    };

    return await this.userRoleRepository.insertRole(newRole);
  }

  async editRoleByPanel(data, userId): Promise<any> {
    let foundRole = null;
    await this.userRoleRepository
      .findARoleById(data.roleId)
      .then((data) => {
        foundRole = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a role!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    if (foundRole) {
      foundRole.department = data.department;
      foundRole.name = data.name;
      foundRole.label = data.label;
      foundRole.description = data.description;
      foundRole.deletable = data.deletable;
      foundRole.permissions = data.permissions;
      foundRole.updateDate = new Date();
      foundRole.updatedBy = userId;

      await this.userRoleRepository
        .editRole(foundRole._id, foundRole)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while editing a user role!';
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    } else {
      let errorMessage =
        'Some errors occurred while finding a role!. Role not found!';
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
    }

    return this.result;
  }

  async findARoleByName(roleName): Promise<UserRole | undefined> {
    await this.userRoleRepository
      .findARoleByName(roleName)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a role!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async findARoleByShortName(shortName: string): Promise<UserRole | undefined> {
    let roleName = '';
    this.defaultRoles.forEach((role) => {
      if (role.short == shortName) {
        roleName = role.roleName;
      }
    });
    await this.userRoleRepository
      .findARoleByName(roleName)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a role!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async findRoleByDepartment(roleDepartment): Promise<UserRole | undefined> {
    await this.userRoleRepository
      .findRoleByDepartment(roleDepartment)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a role!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async findARoleByLabel(roleLabel): Promise<UserRole | undefined> {
    await this.userRoleRepository
      .findARoleByLabel(roleLabel)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a role!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async changeActivationStatusOfRole(data, userId): Promise<any> {
    let foundRole = null;
    await this.userRoleRepository
      .findARoleById(data._id)
      .then((data) => {
        foundRole = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a role!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    if (foundRole) {
      foundRole.activationStatus = data.activationStatus;
      foundRole.activationStatusChangedBy = userId;
      foundRole.activationStatusChangeDate = new Date();
      foundRole.updatedBy = userId;
      foundRole.updateDate = new Date();

      await this.userRoleRepository
        .editRole(data._id, foundRole)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while editing a role!';
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    } else {
      let errorMessage =
        'Some errors occurred while editing a role! Role not found';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    return this.result;
  }

  async deleteRole(data, userId): Promise<any> {
    let foundRole = null;
    await this.userRoleRepository
      .findARoleById(data._id)
      .then((data) => {
        foundRole = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a role!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    if (foundRole) {
      foundRole.isDeleted = data.isDeleted;
      foundRole.deletionReason = data.deletionReason;
      foundRole.deletedBy = userId;
      foundRole.deleteDate = new Date();

      await this.userRoleRepository
        .editRole(data._id, foundRole)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while editing a role!';
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    } else {
      let errorMessage =
        'Some errors occurred while editing a role! Role not found';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    return this.result;
  }
}
