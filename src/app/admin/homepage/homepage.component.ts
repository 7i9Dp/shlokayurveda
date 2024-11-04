import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductModel } from 'src/app/_interface/product';
import { ProductBookingService } from 'src/app/_services/productbooking.service';
import Swal from 'sweetalert2';
declare const $: any;

export interface contactusModel {
  name:any;
  phone: any;
  email: any;
  address: any;
  concern:any;
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  data: any = [];
  selectedProduct: any;
  selectedProductName : any;
  submitted:boolean = false;
  submitbtn:boolean = false;
  products: ProductModel;
  ID : any;
  quantity:any;
  userForm: FormGroup;
  contactForm: FormGroup;
  contactus:contactusModel;
  viewBox: string = '0 0 100 100';
  // x: string = '-26';
  submitbtnc:boolean=false;
  submitbtnu:boolean=false;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateViewBox();
  }

  private updateViewBox() {
    this.viewBox = window.innerWidth <= 768 ? '0 11 100 85' : '0 0 100 100';
    // this.x = window.innerWidth <= 768 ? '-12' : '-26';
  }

  constructor(private fb : FormBuilder,private ProductBookingService : ProductBookingService ) {
    this.userForm = this.fb.group({
      quantity: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Added email validator
      phone: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      pincode: ['', Validators.required],
    });

    this.contactForm = this.fb.group({
      name: ['',Validators.required],
      phone:['',Validators.required],
      email:['',Validators.required],
      address: ['',Validators.required],
      concern:['',Validators.required],
    });

    this.contactus = {
      name:'',
      phone: '',
      email: '',
      address: '',
      concern:''
    }

    this.products = {
      id:0,
      productid: 0,
      productname:'',
      pack:'',
      quantity: 0,
      email: '',
      phone: '',
      name: '',
      address: '',
      pincode: '',
      include: '',
      price:0,
      oldPrice:0,
      usefor:'',
      duration:'',
      total:0,
      IsKit:false
    };
  }
  ngOnInit(): void {
  this.updateViewBox();
  this.data = [
    {
      "id": 10,
      "imagePath": "../../../assets/img/Home/60 - STRONG JOSH CAPSULE.jpg",
      "imagePath2": "../../../assets/img/Home/STRONGJOSH 30-02.jpeg",
      "productName": "STRONGJOSH BOOSTER CAPTULE",
      "pack": "60 CAPSULE PACK",
      "price": "1099",
      "oldPrice": "1399",
      "IsKit":false
    },
    {
      "id": 11,
      "imagePath": "../../../assets/img/Home/60 - WILD- X CAPSULE.jpg",
      "imagePath2": "../../../assets/img/Home/WILD X 30.jpg",
      "productName": "WILD-X CAPSULE",
      "pack": "60 CAPSULE PACK",
      "price": "1499",
      "oldPrice": "1799",
      "IsKit":false
    },
    {
      "id": 12,
      "imagePath": "../../../assets/img/Home/HARD - X SPRAY .jpg",
      "imagePath2": "../../../assets/img/Home/HARD-X WHITE 2-02.jpeg",
      "productName": "HARD-X SPRAY",
      "pack": "30 ml",
      "price": "799",
      "oldPrice": "999",
      "IsKit":false
    },
    {
      "id": 13,
      "imagePath": "../../../assets/img/Home/CONSTIBEST POWDER.jpg",
      "imagePath2": "../../../assets/img/Home/Constibest Mockup.jpg",
      "productName": "COSTIBEST POWDER",
      "pack": "100 gm",
      "price": "699",
      "oldPrice": "799",
      "IsKit":false
    },
    {
      "id": 14,
      "imagePath": "../../../assets/img/Home/GASOLEFT CAPSULE.jpg", 
      "imagePath2": "../../../assets/img/Home/GASOLEFT CAPS WHITE-02.jpeg",
      "productName": "GASOLEFT CAPSULES",
      "pack": "30 CAPSULES",
      "price": "499",
      "oldPrice": null,
      "IsKit":false
    },
    {
      "id": 15,
      "imagePath": "../../../assets/img/Home/PILOLEX CAPSULE.jpg",
      "imagePath2": "../../../assets/img/Home/Pilolex Mockup.jpg",
      "productName": "PILOLEX CAPSULE",
      "pack": "30 CAPSULE PACK",
      "price": "599",
      "oldPrice": null,
      "IsKit":false
    },
    {
      "id": 16,
      "imagePath": "../../../assets/img/Home/WILD X CAPSULE.jpg",
      "imagePath2": "../../../assets/img/Home/WILD X 30.jpg",
      "productName": "WILD-X CAPSULE",
      "pack": "30 CAPSULE PACK",
      "price": "799",
      "oldPrice": "999",
      "IsKit":false
    },
    {
      "id": 17,
      "imagePath": "../../../assets/img/Home/STRONG JOSH BOOSTER CAPSULE .jpg",
      "imagePath2": "../../../assets/img/Home/STRONGJOSH 30-02.jpeg",
      "productName": "STRONGJOSH BOOSTER CAPTULES",
      "pack": "30 CAPSULE PACK",
      "price": "699",
      "oldPrice": "799",
      "IsKit":false
    }
  ]

  }

  Buynow(product:any){
    this.selectedProduct = product;
     $("#productModal").modal('toggle');
  }

  
  get f() { return this.contactForm.controls; }
  get uf() { return this.userForm.controls; }


  onSubmit(): void {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    else {
      this.submitbtn = true;
      this.products.id = this.ID || 0;
      this.products.productid = this.selectedProduct.id;
      this.products.productname = this.selectedProduct.productName;
      this.products.pack = this.selectedProduct.pack;
      this.products.quantity = this.userForm.value.quantity;
      this.products.email = this.userForm.value.email;
      this.products.phone = this.userForm.value.phone;
      this.products.name = this.userForm.value.name;
      this.products.address = this.userForm.value.address;
      this.products.pincode = this.userForm.value.pincode;
      this.products.price =  this.selectedProduct.price;
      this.products.total = (this.userForm.value.quantity) * (this.selectedProduct.price);
      this.products.IsKit =  this.selectedProduct.IsKit;
      this.ProductBookingService.insertProduct(this.products).subscribe(
        res => {
          if (res.isSuccess) {
            Swal.fire('', res.returnMessage, 'success');
          }
          else {
            Swal.fire('', res.returnMessage, 'error');
          }
          $("#productModal").modal('toggle');
          this.resetForm();
        },
        err => {
          Swal.fire('', err.error.message, 'error');
        }
      );
    }
  }

  resetForm(): void {
    this.submitted=false;
    this.submitbtn=false;
    this.userForm.reset();       
    this.quantity = 1;           
    this.userForm.get('quantity')?.setValue(1); 
  }

  onSubmitContactUs(): void {
    debugger
    this.submitted = true;
    if (this.contactForm.invalid) {
      return;
    } else {
      debugger
      this.submitbtnc=true;
      this.contactus.name = this.contactForm.value.name,
        this.contactus.phone = this.contactForm.value.phone,
        this.contactus.email = this.contactForm.value.email,
        this.contactus.address = this.contactForm.value.address,
        this.contactus.concern = this.contactForm.value.concern
      this.ProductBookingService.insertContactUSDetails(this.contactus).subscribe(
        res => {
          if (res.isSuccess) {
            Swal.fire(
              'Thank you for reaching out!',
              'Your request has been submitted successfully. Our team will get in touch within 24 hours. Stay tuned!',
              'success'
            );
            this.resetContact();
          } else {
            Swal.fire('Error', res.returnMessage, 'error');
          }
        },
        err => {
          Swal.fire('Error', err.error.message, 'error');
        }
      );
    }
  }
  
  resetContact(){
    this.submitted = false;
    this.submitbtnc=false;
    this.contactForm = this.fb.group({
      name: ['',Validators.required],
      phone:['',Validators.required],
      email:['',Validators.required],
      address: ['',Validators.required],
      concern:['',Validators.required],
    });
  }
}
