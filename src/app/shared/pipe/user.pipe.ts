import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userRole',
})
export class UserRolePipe implements PipeTransform {
  transform(role: string): string {
    return role === 'user' ? '普通用户' : '管理员';
  }
}
