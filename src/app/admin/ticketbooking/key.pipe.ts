import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'key',
})
export class KeyPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return Object.keys(value)[0];
  }
}
