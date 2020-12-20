import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleStatus',
})
export class RoleStatusPipe implements PipeTransform {
  transform(roleStatus: number): string {
    // 0-锁定，1-正常，2-假删除
    let roleStatusStr = '正常';
    switch (roleStatus) {
      case 0: {
        roleStatusStr = '锁定';
        break;
      }
      case 2: {
        roleStatusStr = '删除';
        break;
      }
      default: {
        roleStatusStr = '正常';
      }
    }
    return roleStatusStr;
  }
}
