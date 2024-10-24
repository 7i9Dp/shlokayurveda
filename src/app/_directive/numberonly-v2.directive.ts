import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberonlyV2]'
})
export class NumberonlyV2Directive {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: { stopPropagation: () => void; }) {
		const initalValue = this.el.nativeElement.value;
    const initalVal = this.el.nativeElement.value;
		this.el.nativeElement.value = initalValue.replace(/^-?[1-9][0-9][1-9]\d*$/, '');
		if (initalValue !== this.el.nativeElement.value) {
			event.stopPropagation();
		}
	}

}
