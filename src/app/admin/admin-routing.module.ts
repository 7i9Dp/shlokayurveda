import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { TicketbookingComponent } from './ticketbooking/ticketbooking.component';
import { TicketreportsComponent } from './ticketreports/ticketreports.component';
import { HomepageComponent } from './homepage/homepage.component';
import { TickettypeComponent } from './tickettype/tickettype.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [{
  path: '', component: AdminComponent,
  children: [
    { path: '', component: HomepageComponent, title: 'Welcome to Shlok Ayurveda' },
    { path: 'book-ticket', component: TicketbookingComponent, title: 'Booking - Book Ticket' },
    { path: 'contact-us', component: TickettypeComponent, title: 'Contact Us' },
    { path: 'ticket-reports', component: TicketreportsComponent, title: 'Reports - Ticket' },
    { path: 'product-details/:id', component: ProductDetailsComponent, title: 'Product - Details Page' },
    { path: 'cart', component: CartComponent, title: 'Your Cart' },
    { path: 'info-page', component: InfoPageComponent, title: 'Info - Details Page' },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
