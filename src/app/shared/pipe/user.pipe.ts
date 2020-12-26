import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userRole',
})
export class UserRolePipe implements PipeTransform {
  transform(role: string): string {
    return role === 'user' ? '普通用户' : '管理员';
  }
}

@Pipe({
  name: 'nodeStatus',
})
export class NodeStatusPipe implements PipeTransform {
  transform(node: number): string {
    // 已完成1/已开始未完成0/未开始-1
    let statusStr = '已完成';
    switch (node) {
      case 1: {
        statusStr = '已完成';
        break;
      }
      case 0: {
        statusStr = '进行中';
        break;
      }
      default: {
        statusStr = '待开始';
      }
    }
    return statusStr;
  }
}
