import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modelPipe',
})
export class ModelPipe implements PipeTransform {
  transform(value: number): string {
    switch (
      value // 1-训练中 2-训练完成 3-训练失败
    ) {
      case 1:
        return '训练中';
      case 2:
        return '训练完成';
      case 3:
        return '训练失败';
    }
  }
}
