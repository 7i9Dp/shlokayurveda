import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { ProductModel } from 'src/app/_interface/product';
import { CartLine, CartService } from 'src/app/_services/cart.service';
import { ProductBookingService } from 'src/app/_services/productbooking.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  lines: CartLine[] = [];
  userForm: FormGroup;
  submitted = false;
  submitbtn = false;

  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private cart: CartService,
    private router: Router,
    private ProductBookingService: ProductBookingService
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      name: ['', Validators.required],
      address: ['', Validators.required],
      pincode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.subs.add(this.cart.items.subscribe(lines => this.lines = lines));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get uf() { return this.userForm.controls; }

  get subtotal(): number {
    return this.cart.subtotal;
  }

  get savings(): number {
    return this.lines.reduce(
      (sum, l) => sum + (l.oldPrice ? (l.oldPrice - l.price) * l.quantity : 0), 0
    );
  }

  changeQuantity(line: CartLine, delta: number): void {
    this.cart.changeQuantity(line.id, delta);
  }

  setQuantity(line: CartLine, event: any): void {
    this.cart.setQuantity(line.id, event.target.value);
  }

  remove(line: CartLine): void {
    this.cart.remove(line.id);
  }

  continueShopping(): void {
    this.router.navigate(['/admin']);
  }

  /**
   * The order API takes one product per call, so a multi-line cart becomes one
   * call per line with the exact same payload shape the single-product form
   * sends. Nothing about the endpoint or field names changes.
   */
  onSubmit(): void {
    this.submitted = true;
    if (this.userForm.invalid || !this.lines.length) {
      return;
    }

    this.submitbtn = true;
    const buyer = this.userForm.value;

    const requests = this.lines.map(line => {
      const order: ProductModel = {
        id: 0,
        productid: line.id,
        productname: line.productName,
        pack: line.pack || '',
        quantity: line.quantity,
        email: buyer.email,
        phone: buyer.phone,
        name: buyer.name,
        address: buyer.address,
        pincode: buyer.pincode,
        include: line.IsKit && line.Include?.length ? line.Include.join(', ') : '',
        price: line.price,
        oldPrice: 0,
        usefor: line.IsKit && line.usefor ? line.usefor : '',
        duration: line.IsKit && line.duration ? line.duration : '',
        total: line.price * line.quantity,
        IsKit: line.IsKit
      };
      return this.ProductBookingService.insertProduct(order);
    });

    forkJoin(requests).subscribe(
      results => {
        const failed = results.filter(r => !r.isSuccess);
        this.submitbtn = false;

        if (failed.length) {
          Swal.fire('', failed[0].returnMessage, 'error');
          return;
        }

        Swal.fire(
          'Order placed!',
          'Our team will call you shortly to confirm your order.',
          'success'
        );
        this.cart.clear();
        this.submitted = false;
        this.userForm.reset();
      },
      err => {
        this.submitbtn = false;
        Swal.fire('', err.error?.message || 'Something went wrong. Please try again.', 'error');
      }
    );
  }
}
