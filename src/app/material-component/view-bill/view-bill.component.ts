import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Route, Router } from '@angular/router';
import { error } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { eventNames } from 'process';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { MatTableModule } from '@angular/material/table';
import { ConfigurableFocusTrap } from '@angular/cdk/a11y';
import { ConfirmationComponent } from '../dialog/view-bill-products/confirmation/confirmation.component';
import { saveAs } from 'file-saver';
import { RouteGuardService } from 'src/app/services/route-guard.service';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  displayedColumns: string[] = ['id','name', 'email', 'contactNumber', 'paymentMethod', 'total','deliveryAddress','view'];
  dataSource: any;
  responseMessage: any;
  userRole:any;

  constructor(private billService: BillService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private routeGuardService:RouteGuardService,
    private router: Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.userRole=this.routeGuardService.getUserRole();
    this.tableData();
      
    
  }
  tableData() {
    this.billService.getBills().subscribe((response: any) => {
      this.ngxService.stop();
      response.forEach((bill: any) => {
        // Assuming 'addedDateTime' is a property where you want to store the timestamp
        bill.addedDateTime = new Date(bill.timestamp); // Replace 'timestamp' with the actual timestamp property in your bill data
      });
      this.dataSource = new MatTableDataSource(response);
    }, (error: any) => {
      this.ngxService.stop();
      console.log(error);
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

  handleViewAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: values
    }
    dialogConfig.width = "100%";
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    })


  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete' + values.name + 'bill',
      confrimation: true
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response: any) => {
      this.ngxService.start();
      this.deleteBill(values.id);
      dialogRef.close();

    })

  }

  deleteBill(id: any) {
    this.billService.delete(id).subscribe((response: any) => {
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");


    }, (error: any) => {
      this.ngxService.stop();
      console.log(error);
      if (error.error?.messages) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  downloadReportAction(values: any) {
    this.ngxService.start();
    var data={
      name:values.name,
      email:values.id,
      uuid:values.uuid,
      contactNumber:values.contactNumber,
      paymentMethod:values.paymentMethod,
      total:values.total.toString(),
      productDetails:values.productDetail
    }
    this.downloadFile(values.uuid,data);
   }

   downloadFile(fileName:string, data:any){
    this.billService.getPdf(data).subscribe((response)=>{
      saveAs(response,fileName+'.pdf');
      this.ngxService.stop();
    })
   }


   
  printBill(values: any) {
    this.ngxService.start();
    var data = {
      name: values.name,
      email: values.id,
      uuid: values.uuid,
      contactNumber: values.contactNumber,
      paymentMethod: values.paymentMethod,
      total: values.total.toString(),
      productDetails: values.productDetail
    }
    this.downloadAndPrintBill(values.uuid, data);
    this.ngxService.stop();
  }

  downloadAndPrintBill(fileName: string, data: any) {
    this.billService.getPdf(data).subscribe((response) => {
      // Create a Blob containing the PDF data
      const blob = new Blob([response], { type: 'application/pdf' });
      const pdfUrl = window.URL.createObjectURL(blob);

      // Open a new window with the PDF and trigger print
      const newWindow = window.open(pdfUrl, '_blank');
      if (newWindow) {
        newWindow.onload = () => {
          newWindow.print();
          newWindow.onafterprint = () => {
            newWindow.close();
            this.ngxService.stop();
          };
        };
      } else {
        this.ngxService.stop();
        this.snackbarService.openSnackBar('Failed to open the print window.', GlobalConstants.error);
      }
    });
  }


}

