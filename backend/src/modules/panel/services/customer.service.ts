import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CustomerRepository } from '../repositories/customer.repository';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { HomeService } from './home.service';
import { ActivityService } from './activity.service';
import { DeviceService } from './device.service';

/**
 * Customer manipulation service.
 */

const saltRounds = 10;

@Injectable()
export class CustomerService {
  private result;

  constructor(
    /*  @InjectConnection('panelDb') 
        private connection: Connection, */
    private readonly customerRepository?: CustomerRepository,
    private readonly homeService?: HomeService,
    private readonly activityService?: ActivityService,
    private readonly deviceService?: DeviceService,
  ) {}

  async hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 2048, 32, 'sha512')
      .toString('hex');
    return [salt, hash].join('$');
  }

  /* async findACustomerByEmail(
    email,
    whereCondition,
    populateCondition,
    selectCondition,
  ) {
    return await this.customerRepository.findCustomerByEmail(
      email,
      whereCondition,
      populateCondition,
      selectCondition,
    );
  }

  async findACustomerById(customerId) {
    let whereCondition = {};
    let populateCondition = [];
    let selectCondition =
      'IsActive Email Username Password NewPassword FirstName LastName Mobile createdAt updatedAt';

    return await this.customerRepository.findCustomerById(
      customerId,
      whereCondition,
      populateCondition,
      selectCondition,
    );
  }

  async checkCustomerEmailIsExist(customerEmail) {
    let whereCondition = {};
    let populateCondition = [];
    let selectCondition =
      'IsActive Email Username Password FirstName LastName Mobile createdAt updatedAt';
    let foundCustomer = null;

    console.log('I am in checkCustomerEmailIsExist!');

    foundCustomer = await this.findACustomerByEmail(
      customerEmail,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (foundCustomer) {
      console.log('Customer found!');
      return true;
    } else {
      console.log('Customer not found!');
      throw new GeneralException(
        ErrorTypeEnum.NOT_FOUND,
        'Customer does not exist.',
      );
      // return false
    }
  }

  async insertCustomer(body) {
    const salt = bcrypt.genSaltSync(saltRounds);

    let newCustomer = {
      IsActive: false,
      Email: body.email,
      Username: body.userName,
      // Password: bcrypt.hashSync(String(body.password), salt),
      Password: await this.hashPassword(body.password),
      FirstName: body.firstName,
      LastName: body.lastName,
      Mobile: body.mobile,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let insertedCustomer = await this.customerRepository.insertCustomer(
      newCustomer,
    );
    console.log('Customer inserted!');
    return insertedCustomer;
  }

  async editCustomer(id, data) {
    let editedCustomer = await this.customerRepository.editCustomer(id, data);
    return editedCustomer;
  }

  async getCutomerProfileByEmail(customerEmail) {
    let whereCondition = {};
    let populateCondition = [];
    let selectCondition =
      'IsActive Email Username Password FirstName LastName Mobile createdAt updatedAt';

    console.log('we are in getCutomerProfileByEmail service!');

    console.log(
      'Found customer is: ',
      await this.customerRepository.findCustomerByEmail(
        customerEmail,
        whereCondition,
        populateCondition,
        selectCondition,
      ),
    );

    return await this.customerRepository.findCustomerByEmail(
      customerEmail,
      whereCondition,
      populateCondition,
      selectCondition,
    );
  }

  async changeActivationStatusOfCustomer(data): Promise<any> {
    let foundCustomer = null;
    await this.findACustomerById(data._id)
      .then((data) => {
        foundCustomer = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a customer!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    foundCustomer.IsActive = data.isActive;
    foundCustomer.updatedAt = new Date();

    await this.customerRepository
      .editCustomer(data._id, foundCustomer)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while editing a customer in customer service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async customerProfileResponse(data) {
    return {
      _id: data._id,
      isActive: data.IsActive ? data.IsActive : 'N/A',
      email: data.Email ? data.Email : 'N/A',
      userName: data.Username ? data.Username : 'N/A',
      password: data.Password ? data.Password : 'N/A',
      newPassword: data.NewPassword ? data.NewPassword : 'N/A',
      firstName: data.FirstName ? data.FirstName : 'N/A',
      lastName: data.LastName ? data.LastName : 'N/A',
      mobile: data.Mobile ? data.Mobile : 'N/A',
      createdAt: data.createdAt ? data.createdAt : 'N/A',
      updatedAt: data.updatedAt ? data.updatedAt : 'N/A',
    };
  }

  async deleteCustomerPermanently(customerId) {
    await this.customerRepository
      .deleteCustomerPermanently(customerId)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting customer in customer service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async deleteAllCustomerDataPermanently(customerId, customerHomeId) {
    await this.activityService
      .deleteCustomerAllActivitiesPermanently(customerHomeId)
      .then(async (data) => {
        await this.deviceService
          .deleteCustomerAllDevicesPermanently(customerHomeId)
          .then(async (data) => {
            await this.homeService
              .deleteCustomerHomePermanently(customerHomeId)
              .then(async (data) => {
                await this.deleteCustomerPermanently(customerId)
                  .then(async (data) => {
                    this.result = data;
                  })
                  .catch((error) => {
                    let errorMessage =
                      'Some errors occurred while deleting customer in customer service!';
                    throw new GeneralException(
                      ErrorTypeEnum.UNPROCESSABLE_ENTITY,
                      errorMessage,
                    );
                  });
                this.result = data;
              })
              .catch((error) => {
                let errorMessage =
                  'Some errors occurred while deleting home in customer service!';
                throw new GeneralException(
                  ErrorTypeEnum.UNPROCESSABLE_ENTITY,
                  errorMessage,
                );
              });
          })
          .catch((error) => {
            let errorMessage =
              'Some errors occurred while deleting devices in customer service!';
            throw new GeneralException(
              ErrorTypeEnum.UNPROCESSABLE_ENTITY,
              errorMessage,
            );
          });
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while deleting activities in customer service!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  } */
}
