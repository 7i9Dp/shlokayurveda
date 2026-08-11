import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TickettypeComponent } from './tickettype/tickettype.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NumberonlyDirective } from '../_directive/numberonly.directive';
import { Numberonly10digitDirective } from '../_directive/numberonly10digit.directive';
import { TicketbookingComponent } from './ticketbooking/ticketbooking.component';
import { TicketreportsComponent } from './ticketreports/ticketreports.component';
import { HomepageComponent } from './homepage/homepage.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { CartComponent } from './cart/cart.component';


@NgModule({
  declarations: [
    AdminComponent,
    NavbarComponent,
    FooterComponent,
    ProductDetailsComponent,
    TickettypeComponent,
    NumberonlyDirective,
    Numberonly10digitDirective,
    TicketbookingComponent,
    TicketreportsComponent,
    HomepageComponent,
    InfoPageComponent,
    CartComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]

})
export class AdminModule { }
