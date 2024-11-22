import {  HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { runInThisContext } from 'vm';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BillService {
  url = environment.apiUrl;
  
 

  constructor(private httpClient: HttpClient
    ) { }

  generateBill(data: any) {
    return this.httpClient.post(this.url + "/bill/generateBill", data, {
      headers: new HttpHeaders().set('Content-Type',"application/json")
        })
  }

  getPdf(data:any):Observable<Blob>{
    return this.httpClient.post(this.url + "/bill/getPdf", data,{ responseType: 'blob'});

  }
  getBills(){
    return this.httpClient.get(this.url+"/bill/getBills");
  }

  delete(id:any){
    return this.httpClient.post(this.url+"/bill/deleteBill/"+id,{
      headers:new HttpHeaders().set('Content-Type',"application/json")

    });
  }

  getAllOrder(){
    return this.httpClient.get(this.url+"/bill/getAllOrderCountByName");
  }

  autoPrintPdf(data: any) {
    return this.httpClient.post(this.url + "/bill/autoPrintPdf", +data)};

    getAllSales(){
      return this.httpClient.get(this.url+"/bill/getProductSaleAll");
    }

  
  }



