import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HomeComponent } from './home/home.component';
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
import { HeaderComponent } from './header/header.component';
import { ContentPageComponent } from './content-page/content-page.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ProductpageComponent } from './productpage/productpage.component';
import { ContactUsComponent } from './contact-us/contact-us.component';


@NgModule({
  declarations: [
    AdminComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    ProductDetailsComponent,
    TickettypeComponent,
    NumberonlyDirective,
    Numberonly10digitDirective,
    TicketbookingComponent,
    TicketreportsComponent,
    HeaderComponent,
    ContentPageComponent,
    HomepageComponent,
    ProductpageComponent,
    ContactUsComponent
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
