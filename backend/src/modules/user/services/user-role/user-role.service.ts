import { Injectable } from '@nestjs/common';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { RoleActivationStatusEnum } from '../../enums/role-activation-status.enum';
import { RoleDepartmentsEnum } from '../../enums/role-departments.enum';
import { UserRoleRepository } from '../../repositories/user-role.repository';
import { UserPermissionService } from '../user-permission/user-permission.service';

// This should be a real class/interface representing a user entity
export type UserRole = any;

@Injectable()
export class UserRoleService {
  private result;

  constructor(
    private readonly userRoleRepository?: UserRoleRepository,
    private readonly userPermissionService?: UserPermissionService,
  ) {}

  async insertDefaultRoles(): Promise<any> {
    if (!(await this.roleExists('super_admin'))) {
      let permissions: string[] = [];
      let fullControllPermission = await this.userPermissionService
        .findAPermissionByName('full_controll')
        .catch((error) => {
          let errorMessage =
            'Some errors occurred while finding user permission!';
          throw new GereralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });

      permissions.push(fullControllPermission._id);

      let newRole = {
        name: 'super_admin',
        department: RoleDepartmentsEnum.ADMINS,
        label: 'main_admin',
        deletable: false,
        permissions: permissions,
        activationStatus: RoleActivationStatusEnum.ACTIVATED,
        insertDate: new Date(),
        updateDate: new Date(),
      };

      await this.userRoleRepository
        .insertRole(newRole)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage =
            'Some errors occurred while inserting a admin user!';
          throw new GereralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    }

    if (!(await this.roleExists('ordinary'))) {
      let permissions: string[] = [];
      let fullControllPermission = await this.userPermissionService
        .findAPermissionByName('read_content')
        .catch((error) => {
          let errorMessage =
            'Some errors occurred while finding user permission!';
          throw new GereralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });

      permissions.push(fullControllPermission._id);

      let newRole = {
        name: 'ordinary',
        department: RoleDepartmentsEnum.USERS,
        label: 'ordinary_user',
        deletable: false,
        permissions: permissions,
        activationStatus: RoleActivationStatusEnum.ACTIVATED,
        insertDate: new Date(),
        updateDate: new Date(),
      };

      await this.userRoleRepository
        .insertRole(newRole)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage =
            'Some errors occurred while inserting a admin user!';
          throw new GereralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
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
        throw new GereralException(
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
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
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
          throw new GereralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    } else {
      let errorMessage =
        'Some errors occurred while finding a role!. Role not found!';
      throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
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
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
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
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
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
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
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
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
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
          throw new GereralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    } else {
      let errorMessage =
        'Some errors occurred while editing a role! Role not found';
      throw new GereralException(
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
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
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
          throw new GereralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    } else {
      let errorMessage =
        'Some errors occurred while editing a role! Role not found';
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    return this.result;
  }
}
