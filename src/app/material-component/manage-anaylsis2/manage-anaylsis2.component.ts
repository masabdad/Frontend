import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';

@Component({
  selector: 'app-manage-anaylsis2',
  templateUrl: './manage-anaylsis2.component.html',
  styleUrls: ['./manage-anaylsis2.component.scss']
})
export class ManageAnaylsis2Component implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'total'];
  dataSource: any;
  topCustomers: any[] = [];
  isLoading: boolean = false;
  currentDateAndTime: string = '';
  totalRevenue: any;
  soldProductsDetails: any;
  lastResetMonth: number = -1;
  totalProductsSold: any;
  totalValueSold:any;
  highestSoldProduct: any = null;
  highestSoldProductCount: number = 0;
  totalAmountSoldForHighest:any;



  constructor(
    private billService: BillService,
    private snackBar: MatSnackBar,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.getAllSales();
    this.calculateTotalRevenue();
    this.updateCurrentDateAndTime();
    setInterval(() => {
      this.updateCurrentDateAndTime();
      this.checkForMonthReset();
    }, 1000); 
    
  }

 
  getAllSales() {
    this.isLoading = true;

    this.billService.getBills().subscribe(
      (response: any) => {
        this.dataSource = response;
        this.soldProductsDetails = this.extractSoldProductsDetails(response);
        this.calculateTotalProductsSold();
        this.calculateHighestSoldProduct();
        this.isLoading = false;
      },
      (error: any) => {
        console.error(error);
        this.isLoading = false;
        this.snackBar.open('Error fetching sales data', 'Close', { duration: 3000 });
      }
    );
    
  }

  calculateTotalRevenue() {
    this.billService.getBills().subscribe(
      (response: any) => {
        this.totalRevenue = response.reduce((total: number, bill: any) => total + bill.total, 0);
      },
      (error: any) => {
        console.error(error);
        this.snackBar.open('Error calculating total revenue', 'Close', { duration: 3000 });
      }
    );
  }

  extractSoldProductsDetails(bills: any[]) {
    const soldProductsDetails: any[] = [];

    bills.forEach((bill) => {
      const products = JSON.parse(bill.productDetails);

      products.forEach((product: any) => {
        const existingProductIndex = soldProductsDetails.findIndex((soldProduct) => soldProduct.id === product.id);

        if (existingProductIndex !== -1) {
          soldProductsDetails[existingProductIndex].quantity += product.quantity;
          soldProductsDetails[existingProductIndex].total += product.total;
        } else {
          soldProductsDetails.push({
            id: product.id,
            name: product.name,
            category: product.category,
            quantity: product.quantity,
            total: product.total,
          });
        }
      });
    });

    return soldProductsDetails;
  }

  updateCurrentDateAndTime() {
    const now = new Date();
    this.currentDateAndTime = now.toLocaleString();
  }

  checkForMonthReset() {
    const now = new Date();
    const currentMonth = now.getMonth();

    if (this.lastResetMonth === -1) {
      this.lastResetMonth = currentMonth;
    } else if (currentMonth !== this.lastResetMonth) {
      this.totalRevenue = 0;
      this.lastResetMonth = currentMonth;
    }
  }

  calculateTotalProductsSold() {
    if (!this.soldProductsDetails || this.soldProductsDetails.length === 0) {
      return; // No data available
    }
  
    // Initialize variables for total quantity and total value sold
    let totalQuantitySold = 0;
    let totalValueSold = 0;
  
    // Iterate through the sold products to calculate the total quantity and total value sold
    for (const product of this.soldProductsDetails) {
      totalQuantitySold += product.quantity;
      totalValueSold += product.total * product.quantity;
    }
  
    // Set the calculated totals in the class properties
    this.totalProductsSold = totalQuantitySold;
    this.totalValueSold = totalValueSold;
  }
  

calculateHighestSoldProduct() {
  if (!this.soldProductsDetails || this.soldProductsDetails.length === 0) {
    return; // No data available
  }

  // Initialize variables to keep track of the highest sold product and count
  let highestSoldCount = 0;
  let highestSoldProduct = null;

  // Create a map to store the total number of times each product was sold
  const productSoldCountMap = new Map();

  // Iterate through the sold products to count the number of times each product was sold
  for (const product of this.soldProductsDetails) {
    const productId = product.id;

    // Check if the product id is already in the map
    if (productSoldCountMap.has(productId)) {
      // If yes, increment the sold count
      const existingCount = productSoldCountMap.get(productId);
      productSoldCountMap.set(productId, existingCount + 1);
    } else {
      // If no, initialize the sold count for the product
      productSoldCountMap.set(productId, 1);
    }

    // Check if the current product has a higher sold count
    if (productSoldCountMap.get(productId) > highestSoldCount) {
      highestSoldCount = productSoldCountMap.get(productId);
      highestSoldProduct = product;
    }
  }

  // Set the highest sold product and count in the class properties
  this.highestSoldProduct = highestSoldProduct;
  this.highestSoldProductCount = highestSoldCount;
}



}
