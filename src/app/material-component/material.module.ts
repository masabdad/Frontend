import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialRoutes } from './material.routing';
import { MaterialModule } from '../shared/material-module';
import { ViewBillProductsComponent } from './dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from './dialog/view-bill-products/confirmation/confirmation.component';
import { ChangePasswordComponent } from './dialog/view-bill-products/change-password/change-password.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { CategoryComponent } from './dialog/category/category.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ProductComponent } from './dialog/product/product.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
import { MatTableModule } from '@angular/material/table';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageAnalysisComponent } from './manage-analysis/manage-analysis.component';
import { ManageAnaylsis2Component } from './manage-anaylsis2/manage-anaylsis2.component';
import { ReservationComponentComponent } from './reservation-component/reservation-component.component';
import { ReservationComponent } from './dialog/reservation/reservation.component';
import { ManageEmployeeComponent } from './manage-employee/manage-employee.component';
import { VerificationComponent } from './dialog/verification/verification.component';




@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
    MatTableModule
  ],
  providers: [],
  declarations: [
    ViewBillProductsComponent,
    ConfirmationComponent,
    ChangePasswordComponent,
    ManageCategoryComponent,
    CategoryComponent,
    ManageProductComponent,
    ProductComponent,
    ManageOrderComponent,
    ViewBillComponent,
    ManageUserComponent,
    ManageAnalysisComponent,
    ManageAnaylsis2Component,
    ReservationComponentComponent,
    ReservationComponent,
    ManageEmployeeComponent,
    VerificationComponent
   
  ]
})
export class MaterialComponentsModule {}
