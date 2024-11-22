import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogClose, MatDialogConfig } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { error } from 'console';
import { ProductService } from '../services/product.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../shared/global-constants';
import { ProductComponent } from '../material-component/dialog/product/product.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dataSource:any;
  responseMessage: any;
  snackbarService: any;

  constructor(private dialog:MatDialog,
    private userServices:UserService,
    private router:Router,
    private productService:ProductService,
    private ngxService:NgxUiLoaderService
    


    ) { }

  ngOnInit(): void {

    this.userServices.checkToken().subscribe((response:any)=>{
      this.router.navigate(['/cafe/dashboard']);
    },(error:any)=>{
      console.log(error);
    })

  }
  handleSignupAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width= "550px";
    this.dialog.open(SignupComponent,dialogConfig);
     
  }
  handleForgotPasswordAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width= "550px";
    this.dialog.open(ForgotPasswordComponent,dialogConfig);
     
  }
  handleLoginAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width= "550px";
    this.dialog.open(LoginComponent,dialogConfig);
     
  }
 


  }


  
