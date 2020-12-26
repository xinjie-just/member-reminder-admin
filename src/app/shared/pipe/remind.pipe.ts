import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'remindType',
})
export class RemindTypePipe implements PipeTransform {
  transform(value: number): string {
    // 提醒类型:日常提醒1/办理提醒2/手动添加提醒3
    switch (value) {
      case 1:
        return '日常提醒';
      case 2:
        return '办理提醒';
      case 3:
        return '手动添加提醒';
    }
  }
}
