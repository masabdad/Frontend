import { Component, OnInit } from '@angular/core';
import { BillService } from 'src/app/services/bill.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-manage-analysis',
  templateUrl: './manage-analysis.component.html',
  styleUrls: ['./manage-analysis.component.scss']
})
export class ManageAnalysisComponent implements OnInit {
  displayedColumns: string[] = ['email','contactNumber', 'total'];
  dataSource: any;
  topCustomers: any[] = [];
  isLoading: boolean = false;
  currentDateAndTime: string = '';
  data:any;

  constructor(
    private billService: BillService,
    private snackBar: MatSnackBar,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.generateTopCustomersAnalysis();

    // Update the current date and time every second
    setInterval(() => {
      this.updateCurrentDateAndTime();
    }, 1000); // Update every second
  }

  applyFilter(event:Event){
    const filterValue=(event.target as HTMLInputElement).value;
    this.dataSource.filter=filterValue.trim().toLowerCase();
  }

  generateTopCustomersAnalysis() {
    this.isLoading = true;

    this.ngxService.start();

    this.billService.getBills().subscribe(
      (response: any) => {
        const emailTotalsMap = new Map<string, number>();

        response.forEach((bill: any) => {
          const email = bill.email;
          const total = bill.total;

          if (emailTotalsMap.has(email)) {
            const currentTotal = emailTotalsMap.get(email) || 0;
            emailTotalsMap.set(email, currentTotal + total);
          } else {
            emailTotalsMap.set(email, total);
          }
        });

        const sortedEmailTotals = Array.from(emailTotalsMap).sort((a, b) => b[1] - a[1]);
        this.topCustomers = sortedEmailTotals.map(([email, total]) => ({ email, total }));
        this.isLoading = false;
        this.ngxService.stop();
      },
      (error: any) => {
        console.error(error);
        this.isLoading = false;
        this.snackBar.open('Error fetching top customers', 'Close', { duration: 3000 });
        this.ngxService.stop();
      }
    );
  }

  updateCurrentDateAndTime() {
    const now = new Date();
    this.currentDateAndTime = now.toLocaleString();
  }
}
