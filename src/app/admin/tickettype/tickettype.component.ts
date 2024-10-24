import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare const $: any;

export interface contactusModel {
  name:any;
  phone: any;
  email: any;
  address: any;
}

@Component({
  selector: 'app-tickettype',
  templateUrl: './tickettype.component.html',
  styleUrls: ['./tickettype.component.css']
})
export class TickettypeComponent implements OnInit {

  submitted = false;
  contactus:contactusModel;
  contactForm:FormGroup;

  constructor(private fb: FormBuilder,) {
    this.contactForm = this.fb.group({
      name: [],
      phone:[],
      email:[],
      address: [],
      concern:[],
    });

    this.contactus = {
      name:'',
      phone: '',
      email: '',
      address: '',
    }

  }

  ngOnInit(): void {

  }

  onSubmitContactUs(){}
}
