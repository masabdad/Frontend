import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { UserDataService } from 'src/app/shared/user-data.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  verificationCode: string = '';



  successMessage: any;
  errorMessage: any;
  email: any;
  responseMessage:any;

  constructor(private userDataService: UserDataService,
    private userService: UserService,
    private router: Router,
    private ngxService:NgxUiLoaderService,
    private snackbarService:SnackbarService) { }

  ngOnInit(): void {
   
    
  }
  verifyVerificationCode() {
    if (!this.verificationCode || !this.email) {
      console.log('Email and verification code are required.');
      return;
    }
    const requestBody = {
      email: this.email,
      verificationCode: this.verificationCode,
    };

    this.userService.verifyCode(requestBody).subscribe(
      (response: any) => {
        this.successMessage = 'Verification successful. Account is now active.';
        this.errorMessage = null;
        this.router.navigate(['/']);
      
        
      },
      (error: any) => {
        this.errorMessage =
          'Verification failed. Please check the verification code and email and try again.';
        this.successMessage = null;
      }
    );
  }
  onChange(status:any,id:any){
    this.ngxService.start();
    var data={
      status:status.toString(),
      id:id
    }

    this.userService.update(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage=response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }
      else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })

  }


}
