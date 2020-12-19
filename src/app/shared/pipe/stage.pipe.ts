import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sliceLog',
})
export class SliceLogPipe implements PipeTransform {
  transform(answer: string): string {
    return answer.length > 40 ? answer.slice(0, 40) + '...' : answer;
  }
}
