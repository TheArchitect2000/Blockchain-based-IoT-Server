import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomValidatorService {
  toString(Data) {
    if (String(Data)) {
      return {
        Success: true,
        Result: String(Data),
      };
    } else {
      return {
        Success: false,
        Message: 'Cannot convert this field to string.',
      };
    }
  }

  toNumber(Data) {
    if (Number(Data)) {
      return {
        Success: true,
        Result: Number(Data),
      };
    } else {
      return {
        Success: false,
        Message: 'Cannot convert this field to number.',
      };
    }
  }

  isEmpty(Data) {
    if (Data != '') {
      return {
        Success: true,
        Result: Data,
      };
    } else {
      return {
        Success: false,
        Message: 'This field is required and connot be empty.',
      };
    }
  }

  isDefined(Data) {
    if (Data != undefined) {
      return {
        Success: true,
        Result: Data,
      };
    } else {
      return {
        Success: false,
        Message: 'This field is required and must be defined.',
      };
    }
  }

  isString(Data) {
    if (typeof Data == 'string') {
      return {
        Success: true,
        Result: Data,
      };
    } else {
      return {
        Success: false,
        Message: 'This field is not string type.',
      };
    }
  }

  isNumber(Data) {
    if (typeof Data == 'number') {
      return {
        Success: true,
        Result: Data,
      };
    } else {
      return {
        Success: false,
        Message: 'This field is not number type.',
      };
    }
  }

  isBoolean(Data) {
    if (typeof Data == 'boolean') {
      return {
        Success: true,
        Result: Data,
      };
    } else {
      return {
        Success: false,
        Message: 'This field is not boolean type.',
      };
    }
  }

  isEmail(Data) {
    const pattern = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
    if (pattern.test(String(Data).toLowerCase())) {
      return {
        Success: true,
        Result: Data,
      };
    } else {
      return {
        Success: false,
        Message: 'Email address is invalid.',
      };
    }
  }

  isWebSite(Data) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator
    if (pattern.test(Data)) {
      return {
        Success: true,
        Result: Data,
      };
    } else {
      return {
        Success: false,
        Message: 'Website address is invalid.',
      };
    }
  }

  isIranMobile(Data) {
    const pattern = new RegExp(/^(?:98|\+98|0098|0)?9[0-9]{9}$/);
    if (pattern.test(String(Data).toLowerCase())) {
      return {
        Success: true,
        Result: Data,
      };
    } else {
      return {
        Success: false,
        Message: 'Iran mobile number is invalid.',
      };
    }
  }

  /* isIranNationalCode(Data){
        if (!/^\d{10}$/.test(Data)){
            return {
                Success:false,
                Message:"Iran mobile number is invalid."
            }
        }
        var check = +Data[9];
        var sum = Array(9).fill().map((_, i) => +Data[i] * (10 - i)).reduce((x, y) => x + y) % 11;
        if((sum < 2 && check == sum) || (sum >= 2 && check + sum == 11)){
            return {
                Success:true,
                Result:Data
            }
        } else {
            return {
                Success:false,
                Message:"Iran national code is invalid."
            }
        }
    } */

  trim(Data) {
    if (Data != undefined && Data.trim()) {
      return {
        Success: true,
        Result: Data.trim(),
      };
    } else {
      return {
        Success: false,
        Message: 'Cannot trim this field.',
      };
    }
  }

  trimStart(Data) {
    if (Data != undefined && Data.trimStart()) {
      return {
        Success: true,
        Result: Data.trimStart(),
      };
    } else {
      return {
        Success: false,
        Message: 'Cannot trim start of this field.',
      };
    }
  }

  trimEnd(Data) {
    if (Data != undefined && Data.trimEnd()) {
      return {
        Success: true,
        Result: Data.trimEnd(),
      };
    } else {
      return {
        Success: false,
        Message: 'Cannot trim end of this field.',
      };
    }
  }
}
