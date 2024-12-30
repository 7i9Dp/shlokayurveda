import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductModel } from 'src/app/_interface/product';
import { ProductBookingService } from 'src/app/_services/productbooking.service';
import Swal from 'sweetalert2';
declare const $: any;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})

export class ProductDetailsComponent implements OnInit {
  
  data:any=[];
  product: any = [];
  productId: number=1;
  userForm: FormGroup;
  selectedProduct: any;
  selectedProductName : any;
  submitted:boolean = false;
  submitbtn:boolean = false;
  products: ProductModel;
  ID : any;
  total:any;
  quantity:any;

constructor(private route: ActivatedRoute,private fb : FormBuilder,private ProductBookingService : ProductBookingService){

  this.userForm = this.fb.group({
    quantity: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]], // Added email validator
    phone: ['', Validators.required],
    name: ['', Validators.required],
    address: ['', Validators.required],
    pincode: ['', Validators.required],
  });

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
  this.data = [
    {
      id: 1,
      productName: "Digestive Care Trial Kit",
      imagePath: "../../../assets/img/Home/Kits/Digetive Trial kit.jpg",
      Include :['1. Constibest Powder- 100Gm','2. Gasoleft Capsule - 30 Capsule'],
      price: "1199",
      oldPrice: "1298",
      usefor:'GAS	ACIDITY	CONSTIPATION',
      duration: "15 Days",
      IsKit:true
    },
    {
      id: 2,
      productName: "Digestive Care Full Kit",
      imagePath: "../../../assets/img/Home/Kits/Digetive Full kit.jpg",
      Include :['1. Constibest Powder- 100Gm','2. Gasoleft Capsule - 60 Capsule'],
      price: "1399",
      oldPrice: "1698",
      usefor:'GAS	ACIDITY	CONSTIPATION',
      duration: "30 Days",
      IsKit:true
    },
    {
      id: 3,
      productName: "Digestive Care Strong Kit",
      imagePath: "../../../assets/img/Home/Kits/Digetive Strong kit.jpg",
      Include :['1. Constibest Powder- 100Gm','2. Gasoleft Capsule - 120 Capsule'],
      price: "2099",
      oldPrice: "2597",
      usefor:'GAS	ACIDITY	CONSTIPATION',
      duration: "30 Days",
      IsKit:true
    },
    {
      id: 4,
      productName: "Piles Care Trial Kit",
      imagePath: "../../../assets/img/Home/Kits/Piles trial Kit.jpg",
      Include :['1. Constibest Powder- 100Gm','2. Gasoleft Capsule - 30 Capsule','3. Pilolex Capsule - 30 Capsule'],
      price: "1499",
      oldPrice: "1897",
      usefor:'PILES	FISSURE	FISTULA',
      duration: "15 Days",
      IsKit:true
    },
    {
      id: 5,
      productName: "Piles Care Full Kit",
      imagePath: "../../../assets/img/Home/Kits/Piles Full Kit.jpg",
      Include :['1. Constibest Powder- 100Gm','2. Gasoleft Capsule - 60 Capsule','3. Pilolex Capsule - 60 Capsule'],
      price: "1950",
      oldPrice: "2896",
      usefor:'PILES	FISSURE	FISTULA',
      duration: "30 Days",
      IsKit:true
    },
    {
      id: 6,
      productName: "Piles Care Strong Kit",
      imagePath: "../../../assets/img/Home/Kits/Piles Strong Kit.jpg",
      Include :['1. Constibest Powder- 100Gm','2. Gasoleft Capsule - 60 Capsule','3. Pilolex Capsule - 120 Capsule'],
      price: "2550",
      oldPrice: "4094",
      usefor:'PILES	FISSURE	FISTULA',
      duration: "30 Days",
      IsKit:true
    },
    {
      id: 7,
      productName: "Personal Care Trial Kit",
      imagePath: "../../../assets/img/Home/Kits/Seaxual Trial Kit.jpg",
      Include :['1. Strongjosh Booster Capsule - 30 Capsule','2. Wild-X Capsule - 30 Capsule'],
      price: "1399",
      oldPrice: "1798",
      usefor:'Erectile Dysfunction Men Problems',
      duration: "15 Days",
      IsKit:true
    },
    {
      id: 8,
      productName: "Personal Care Full Kit",
      imagePath: "../../../assets/img/Home/Kits/Seaxual full Kit.jpg",
      Include :['1. Strongjosh Booster Capsule - 30 Capsule','2. Wild-X Capsule - 30 Capsule','3. Double Hard Spray'],
      price: "1950",
      oldPrice: "2797",
      usefor:'Erectile Dysfunction Men Problems',
      duration: "15 Days",
      IsKit:true
    },
    {
      id: 9,
      productName: "Personal Care Strong Kit",
      imagePath: "../../../assets/img/Home/Kits/Seaxual Strong Kit.jpg",
      Include :['1. Strongjosh Booster Capsule - 60 Capsule','2. Wild-X Capsule - 60 Capsule','3. Double Hard Spray'],
      price: "2499",
      oldPrice: "4197",
      usefor:'Erectile Dysfunction Men Problems',
      duration: "30 Days",
      IsKit:true
    },
    {
      id: 10,
      productName: "STRONGJOSH BOOSTER CAPTULE",
      imagePath: "../../../assets/img/Home/60 - STRONG JOSH CAPSULE.jpg",
      "imagePath2": "../../../assets/img/Home/STRONGJOSH 30-02.jpeg",
      pack: "60 CAPSULE PACK",
      price: "1099",
      oldPrice: "1399",
      IsKit:false
    },
    {
      id: 11,
      imagePath: "../../../assets/img/Home/60 - WILD- X CAPSULE.jpg",
      "imagePath2": "../../../assets/img/Home/WILD X 30.jpg",
      productName: "WILD-X CAPSULE",
      pack: "60 CAPSULE PACK",
      price: "1499",
      oldPrice: "1799",
      IsKit:false
    },
    {
      id: 12,
      imagePath: "../../../assets/img/Home/HARD - X SPRAY .jpg",
      "imagePath2": "../../../assets/img/Home/HARD-X WHITE 2-02.jpeg",
      productName: "DOUBLE HARD SPRAY",
      pack: "30 ml",
      price: "799",
      oldPrice: "999",
      IsKit:false
    },
    {
      id: 13,
      imagePath: "../../../assets/img/Home/CONSTIBEST POWDER.jpg",
      "imagePath2": "../../../assets/img/Home/Constibest Mockup.jpg",
      productName: "COSTIBEST POWDER",
      pack: "100 gm",
      price: "699",
      oldPrice: "799",
      IsKit:false
    },
    {
      id: 14,
      imagePath: "../../../assets/img/Home/GASOLEFT CAPSULE.jpg", 
      "imagePath2": "../../../assets/img/Home/GASOLEFT CAPS WHITE-02.jpeg",
      productName: "GASOLEFT CAPSULES",
      pack: "30 CAPSULES",
      price: "399",
      oldPrice: 499,
      IsKit:false
    },
    {
      id: 15,
      imagePath: "../../../assets/img/Home/PILOLEX CAPSULE.jpg",
      "imagePath2": "../../../assets/img/Home/Pilolex Mockup.jpg",
      productName: "PILOLEX CAPSULE",
      pack: "30 CAPSULE PACK",
      price: "499",
      oldPrice: 599,
      IsKit:false
    },
    {
      id: 16,
      imagePath: "../../../assets/img/Home/WILD X CAPSULE.jpg",
      "imagePath2": "../../../assets/img/Home/WILD X 30.jpg",
      productName: "WILD-X CAPSULE",
      pack: "30 CAPSULE PACK",
      price: "799",
      oldPrice: "999",
      IsKit:false
    },
    {
      id: 17,
      imagePath: "../../../assets/img/Home/STRONG JOSH BOOSTER CAPSULE .jpg",
      "imagePath2": "../../../assets/img/Home/STRONGJOSH 30-02.jpeg",
      productName: "STRONGJOSH BOOSTER CAPTULES",
      pack: "30 CAPSULE PACK",
      price: "699",
      oldPrice: "799",
      IsKit:false
    }
  ]

  // Get the `id` from the URL
  this.route.params
    .subscribe(
      (params: Params) => {
        let id = params['id'];
        this.getProductById(id)
      })
}

getProductById(id: number) {
  this.product = this.data[id-1]
  // this.product = this.data.find((p:any) => p.id === id);
}

get uf() { return this.userForm.controls; }

Buynow(product:any){
  this.selectedProduct = product;
   $("#productModal").modal('toggle');
}

updateQuantity(event: any): void {
  this.quantity = event.target.value;
}

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

      if (this.selectedProduct.IsKit) {
        this.products.IsKit = this.selectedProduct.IsKit;

        if (this.selectedProduct.pack) {
          this.products.pack = this.selectedProduct.pack;
        }
        if (this.selectedProduct.duration) {
          this.products.duration = this.selectedProduct.duration;
        }
        if (this.selectedProduct.usefor) {
          this.products.usefor = this.selectedProduct.usefor;
        }
        if (this.selectedProduct.Include && Array.isArray(this.selectedProduct.Include)) {
          const include = this.selectedProduct.Include.join(', ');
          this.products.include = include;
        }
      }
      this.products.quantity = this.userForm.value.quantity;
      this.products.email = this.userForm.value.email;
      this.products.phone = this.userForm.value.phone;
      this.products.name = this.userForm.value.name;
      this.products.address = this.userForm.value.address;
      this.products.pincode = this.userForm.value.pincode;
      this.products.price = this.selectedProduct.price;
      this.products.total = Number(this.userForm.value.quantity) * Number(this.selectedProduct.price);

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

}
