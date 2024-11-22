import { FocusTrap, TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

import { Component, Inject } from '@angular/core';
import { EPROTO, EROFS } from 'constants';
import { error } from 'console';
import { errorMonitor } from 'events';
import { threadId } from 'worker_threads';




@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Add";
  responseMessage: any;
  categorys: any = [];
  selectedImage: File | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder: FormBuilder,
  private productService: ProductService,
  public dialogRef: MatDialogRef<ProductComponent>,
  private categoryService: CategoryService,
  private snackbarService: SnackbarService) { }


  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      categoryId: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]]
    });
    if (this.dialogData.action === "Edit") {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.productForm.patchValue(this.dialogData.data);

    }
    this.getCategorys();
  }
  getCategorys() {
    this.categoryService.getCategorys().subscribe((response: any) => {
      this.categorys = response;

    }, (error: any) => {
      console.log(error);
      if (error.error?.messages) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.unauthorized;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }
  handleSubmit() {
    if (this.dialogAction === "Edit") {
      this.edit();
    } else {
      this.add();
    }
  }
  add() {
    var formData = this.productForm.value;
    var data = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
      image:formData.selectedImage
        }
    this.productService.add(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddProduct.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error) => {
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.unauthorized;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);

    })
  }
  edit(){
    var formData = this.productForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description
    }
    this.productService.update(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditProduct.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error) => {
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.unauthorized;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);

    })
  }
}