import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
})
export class StatusPipe implements PipeTransform {
  transform(status: number): string {
    // 0-锁定，1-正常，2-假删除
    let statusStr = '正常';
    switch (status) {
      case 0: {
        statusStr = '锁定';
        break;
      }
      case 2: {
        statusStr = '删除';
        break;
      }
      default: {
        statusStr = '正常';
      }
    }
    return statusStr;
  }
}

@Pipe({
  name: 'is',
})
export class IsPipe implements PipeTransform {
  transform(value: number): string {
    return value === 0 ? '否' : '是';
  }
}
