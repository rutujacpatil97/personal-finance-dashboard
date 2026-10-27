import { Directive, OnInit, Input, ElementRef } from "@angular/core";

@Directive({
    selector: '[appAmountColor]'
  })
  export class AmountColorDirective implements OnInit {
    @Input() appAmountColor!: number;
  
    constructor(private el: ElementRef) {}

    //income: '#28a745' green
    //expense: '#dc3545' red
  
    ngOnInit() {
      this.el.nativeElement.style.color = this.appAmountColor >= 0 ? '#28a745' : '#dc3545';
    }
    
  }
  