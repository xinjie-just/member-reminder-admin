import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'type',
})
export class NodeBizTypePipe implements PipeTransform {
  transform(type: number): string {
    //提醒办理1,等待批复2
    return type === 1 ? '提醒办理' : '等待批复';
  }
}
