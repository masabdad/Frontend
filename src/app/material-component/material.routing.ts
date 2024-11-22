import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { RouteGuardService } from '../services/route-guard.service';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

import { ManageAnalysisComponent } from './manage-analysis/manage-analysis.component';
import { ManageAnaylsis2Component } from './manage-anaylsis2/manage-anaylsis2.component';
import { ReservationComponentComponent } from './reservation-component/reservation-component.component';
import { ManageEmployeeComponent } from './manage-employee/manage-employee.component';



export const MaterialRoutes: Routes = [
    {
        path:'category',
        component:ManageCategoryComponent,
        canActivate:[RouteGuardService],
        data:{
            expexctedRole:['admin']
        }
    },

    {
        path:'product',
        component:ManageProductComponent,
        canActivate:[RouteGuardService],
        data:{
            expexctedRole:['admin']
        }
    },
    
    {
        path:'order',
        component:ManageOrderComponent,
        canActivate:[RouteGuardService],
        data:{
            expexctedRole:['admin','user']
        }
    },

    {
        path:'bill',
        component:ViewBillComponent,
        canActivate:[RouteGuardService],
        data:{
            expexctedRole:['admin','user']
        }
    },

    {
        path:'user',
        component:ManageUserComponent,
        canActivate:[RouteGuardService],
        data:{
            expexctedRole:['admin']
        }
    },

    {
        path:'analysis',
        component:ManageAnalysisComponent,
        canActivate:[RouteGuardService],
        data:{
            expexctedRole:['admin']
        }
    },

    {
        path:'analysis2',
        component:ManageAnaylsis2Component,
        canActivate:[RouteGuardService],
        data:{
            expexctedRole:['admin']
        }
    },

    {
        path:'reservations',
        component:ReservationComponentComponent,
        canActivate:[RouteGuardService],
        data:{
            expexctedRole:['admin']
        }
    },
    {
        path:'employee',
        component:ManageEmployeeComponent,
        canActivate:[RouteGuardService],
        data:{
            expexctedRole:['admin']
        }
    },


    


];
