import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ProductComponent } from '../product/product.component';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  onAddReservation = new EventEmitter();

  reservationForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Add";
  responseMessage: any;
  reservations: any = [];



  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder: FormBuilder,
  private reservationService: ReservationService,
  public dialogRef: MatDialogRef<ReservationComponent>,
  private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.reservationForm = this.formBuilder.group({
      date: [null, [Validators.required]],
      time: [null, [Validators.required]],
      tableNumber: [null, [Validators.required]],
      numberOfGuests: [null, [Validators.required]],
      customerName: [null, [Validators.required,]],
      customerContact: [null, [Validators.required, Validators.pattern(GlobalConstants.customerContactRegex)]]
      
      
      
      
      

    });
    if (this.dialogData.action === "Edit") {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.reservationForm.patchValue(this.dialogData.data);
    }
    this.getReservation();
  }

  getReservation() {
    this.reservationService.getReservation().subscribe((response: any) => {
      this.reservations = response;

    }, (error: any) => {
      console.log(error);
      if (error.error?.messages) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.reservationError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  handleSubmit() {
      
      this.createReservation();
    
  }
  createReservation() {
    var formData = this.reservationForm.value;
    var data = {
      customerName: formData.customerName,
      customerContact: formData.customerContact,
      date:formData.date,
      time:formData.time,
      numberOfGuests: formData.numberOfGuests,
      status:formData.status,
      tableNumber:formData.tableNumber
     
      
        }
    this.reservationService.createReservation(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddReservation.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error:any) => {
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.reservationError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);

    })
  }


}




