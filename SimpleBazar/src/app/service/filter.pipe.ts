import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(items: any[], search: string): any[] {
    if (!search) return items;
    const lower = search.toLowerCase();
    return items.filter(item => item.Name.toLowerCase().includes(lower));
  }
}
