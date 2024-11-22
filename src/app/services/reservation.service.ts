import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  url=environment.apiUrl;

  constructor(private httpClient:HttpClient) { }

  createReservation(data:any) {
    return this.httpClient.post(this.url+"/reservations/create",data,{
      headers: new HttpHeaders().set('Content-Type', 'application/json')

    });
  }

  getReservation(){
    return this.httpClient.get(this.url+"/reservations/getAll");

  }

  updateReservation(id:any){
    return this.httpClient.post(this.url+"/reservations/update/"+id,{
      headers: new HttpHeaders().set('Content-Type', 'application/json')

    });
  }

  deleteReservation(id:any){
    return this.httpClient.post(this.url+"/reservations/delete/"+id,{
      headers:new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  checkTableAvailability(data:any){
    return this.httpClient.get(this.url+"/reservations/tableAvailable");
  }
}
