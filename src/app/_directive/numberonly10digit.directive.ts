import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberonly10digits]'
})
export class Numberonly10digitDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const inputValue = this.el.nativeElement.value;
    // Remove all non-digit characters
    const cleanedValue = inputValue.replace(/[^0-9]/g, '');
    
    // Limit the value to 10 digits
    const limitedValue = cleanedValue.slice(0, 10);

    // Set the input value to the limited value
    this.el.nativeElement.value = limitedValue;

    // If the input value has changed, emit an input event to update the form control
    if (inputValue !== limitedValue) {
      event.preventDefault();
      const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
        composed: true
      });
      this.el.nativeElement.dispatchEvent(inputEvent);
    }
  }
}
