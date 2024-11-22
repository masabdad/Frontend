import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpentMoneyService {

  url=environment.apiUrl;

  constructor(private httpClient:HttpClient) { }

  getSpentMoneyTotalAll(data: any) {
    return this.httpClient.post('/analysis/getSpentMoneyTotalAll', { params: data });
  }
}
