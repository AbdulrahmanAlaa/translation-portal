import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: any, count?: any): any {
    return value.slice(0, count) + (value.slice(count).replace(/./g, '_'));
  }

}
