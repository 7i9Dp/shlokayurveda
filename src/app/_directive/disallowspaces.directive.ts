import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({  
  selector: 'input[type="text"][formControlName],input[type="text"][formControl],input[type="text"][ngModel]',
})
export class DisallowspacesDirective {
  constructor(private elementRef: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const trimmedValue = value.trimLeft();
    if (value !== trimmedValue) {
      this.elementRef.nativeElement.value = trimmedValue;
      this.elementRef.nativeElement.dispatchEvent(new Event('input'));
    }
  }
}

