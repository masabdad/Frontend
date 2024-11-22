import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  url=environment.apiUrl;

  constructor(private httpClient:HttpClient) { }

  getAllSales(){
    return this.httpClient.get(this.url+"/bill/getProductSaleAll");
  }
}
