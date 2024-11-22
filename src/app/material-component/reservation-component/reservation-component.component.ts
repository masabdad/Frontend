import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReservationService } from 'src/app/services/reservation.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/view-bill-products/confirmation/confirmation.component';
import { ReservationComponent } from '../dialog/reservation/reservation.component';
import { RouteGuardService } from 'src/app/services/route-guard.service';

@Component({
  selector: 'app-reservation-component',
  templateUrl: './reservation-component.component.html',
  styleUrls: ['./reservation-component.component.scss']
})
export class ReservationComponentComponent implements OnInit {
  displayedColumns: string[] = ['id','customerContact', 'customerName', 'date', 'numberOfGuests', 'status','tableNumber','time','edit'];
  dataSource: any;
  length1: any;
  reservations: any[] = [];
  newReservation: any = {};
  responseMessage:any;
  data:any;
  userRole:any;


  constructor(private reservationService:ReservationService,
    private snackbarService:SnackbarService,
    private dialog: MatDialog,
    private ngxService:NgxUiLoaderService,
    private routeGuardService: RouteGuardService,
    private router:Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.userRole = this.routeGuardService.getUserRole();
    this.tableData();
  }

  tableData() {
    this.reservationService.getReservation().subscribe((response: any) => {
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);

    }, (error: any) => {
      this.ngxService.stop();
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  
  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(ReservationComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddReservation.subscribe((reponse: any) => {
      this.tableData();

    })
  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete' + values.name + 'reservations',
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deleteReservation(values.id);
      dialogRef.close();
    }) 
  }
  deleteReservation(id: any) {
    this.reservationService.deleteReservation(id).subscribe((response: any) => {
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");

    }, (error: any) => {
      this.ngxService.stop();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
    

  }

  updateReservation(status: any, id: any) {
    this.ngxService.start();
    var data = {
      status: status.toString(),
      id: id
    }
    this.reservationService.updateReservation(data).subscribe((response: any) => {
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      this.ngxService.stop();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }


  

  

}