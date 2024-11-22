import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { error } from 'console';
import { globalAgent } from 'http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { threadId } from 'worker_threads';
import { saveAs } from 'file-saver';
import { ValueTransformer } from '@angular/compiler/src/util';
import { HttpClient } from '@angular/common/http';
import { Data } from '@angular/router';
import { RouteGuardService } from 'src/app/services/route-guard.service';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categorys: any = [];
  products: any = [];
  total: number = 0;
  responseMessage: any;
  price: any;
  data:any;
  userRole:any;



  constructor(private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private porductService: ProductService,
    private snackbarService: SnackbarService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService,
    private routeGuardService:RouteGuardService,
    private httpClient:HttpClient) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.userRole=this.routeGuardService.getUserRole();
    this.getCategorys();
    this.manageOrderForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod:[null,[Validators.required]],
      deliveryAddress:[null,[Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
      categories: new FormArray([]),
    products: new FormArray([]),  

    });


  }

  

  getCategorys() {
    this.categoryService.getFilteredCategorys().subscribe((response: any) => {
      this.ngxService.stop();
      this.categorys = response;


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
  getProductsByCategory(value: any) {
    this.porductService.getProductsByCategory(value.id).subscribe((response: any) => {
      this.products = response;
      this.manageOrderForm.controls['price'].setValue('');
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue('0');

    }, (error: any) => {
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;

      } else {
        this.responseMessage = GlobalConstants.genericError;

      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  getProductDetails(value: any) {
    this.porductService.getById(value.id).subscribe((response: any) => {
      this.price = response.price;
      this.manageOrderForm.controls['product'].setValue(value);
      this.manageOrderForm.controls['price'].setValue(response.price);
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.price * 1);
      this.updateTotal();

    }, (error: any) => {
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;

      } else {
        this.responseMessage = GlobalConstants.genericError;

      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })

  }

  updateTotal() {
    const price = this.manageOrderForm.controls['price'].value;
    const quantity = this.manageOrderForm.controls['quantity'].value;
    this.manageOrderForm.controls['total'].setValue(price * quantity);
  }
  
  
  
  setQuantity(value: any) {
    var temp = this.manageOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);

    }
    else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * 
      this.manageOrderForm.controls['price'].value);

    }
  }

  validateProductAdd() {
    if (this.manageOrderForm.controls['total'].value === 0 ||
      this.manageOrderForm.controls['total'].value === null ||
      this.manageOrderForm.controls['quantity'].value <= 0) {
      return true;

    }
    else
      return false;


  }
  validateSubmit() {
    if (this.total === 0 ||
      this.manageOrderForm.controls['total'].value === null ||
      this.manageOrderForm.controls['email'].value === null ||
      this.manageOrderForm.controls['contactNumber'].value === null ||
      this.manageOrderForm.controls['paymentMethod'].value === null ||
      this.manageOrderForm.controls['deliveryAddress'].value===null) {
      return true;
    }
    else
      return false;
  }

  add() {
    var formData = this.manageOrderForm.value;
    var productName = this.dataSource.find((e: { id: number }) => e.id === formData.product.id);
    if (productName === undefined) {
      this.total= this.total + formData.total;
      this.dataSource.push({
        id: formData.product.id, name: formData.product.name, category: formData.category.name,
        quantity: formData.quantity, price: formData.price, total: formData.total
      });
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackBar(GlobalConstants.productAdded, "success");
    }
    else {
      this.snackbarService.openSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
    }

  }
  handleDeleteAction(value: any, element: any) {
    this.total = this.total - element.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];

  }

  submitAction() {
    
    var formData = this.manageOrderForm.value;
    var data = {
      fileName:formData.fileName,
      contactNumber: formData.contactNumber,
      email: formData.email,
      name: formData.name,
      paymentMethod: formData.paymentMethod,
      deliveryAddress: formData.deliveryAddress,
      productDetails: JSON.stringify(this.dataSource),
      total: this.total.toString()
    };
  
    this.ngxService.start();
    this.billService.generateBill(data).subscribe(
      (response: any) => {
        this.snackbarService.openSnackBar('Bill generated and downloaded successfully!', 'success');
  
        this.downloadFile(response.uuid);

        this.manageOrderForm.reset();
        this.dataSource = [];
        this.total = 0;
      },
      (error: any) => {
        console.error(error);
        this.snackbarService.openSnackBar('Failed to generate the bill. Please try again later.', 'error');
      }
    );
  }
  downloadFile(fileName: string) {
  var data = {
    uuid: fileName
  };

  this.billService.getPdf(data).subscribe((response: any) => {
    // Download the PDF
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName + '.pdf';
    a.click();
    window.URL.revokeObjectURL(url);

    // Automatically print the downloaded PDF
    this.autoPrintPdf(response);

    this.ngxService.stop();
  });
}

 // ...

 onCategorySelected(event: any) {
  const category = event.source.value;
  const categoriesFormArray = this.manageOrderForm.get('categories') as FormArray;

  if (event.checked) {
    categoriesFormArray.push(new FormControl(category));
  } else {
    const index = categoriesFormArray.controls.findIndex(x => x.value === category);
    categoriesFormArray.removeAt(index);
  }
}


onProductSelected(event: any) {
  const product = event.source.value;
  const productsFormArray = this.manageOrderForm.get('products') as FormArray;

  if (event.checked) {
    productsFormArray.push(new FormControl(product));
  } else {
    const index = productsFormArray.controls.findIndex(x => x.value === product);
    productsFormArray.removeAt(index);
  }

}
printBill(data: any) {
  this.billService.autoPrintPdf(data).subscribe(
    (response: any) => {
      this.autoPrintPdf(response);
    },
    (error: any) => {
      console.error('Error printing bill:', error);
    }
  );
}
autoPrintPdf(data:any) {
  // Make an HTTP GET request to your backend API
  this.httpClient.get('/bill/autoPrintPdf').subscribe(
    (response: any) => {
      // Assuming 'response' contains the PDF content or URL from your backend API
      this.billService.getPdf({ printable: response, type: 'pdf' });
    },
    (error: any) => {
      console.error('Error printing bill:', error);
    }
  );
}


  
}
