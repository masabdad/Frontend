import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }


  createEmployee(data: any) {
    return this.httpClient.post(this.url + "/employee/create", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }


  deleteEmployee(id: any) {
    return this.httpClient.post(this.url + "/employee/delete/" + id, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')

    })
  }

  getAllEmployee() {
    return this.httpClient.get(this.url + "/employee/getAll");
  }

  updateEmployee(id:any) {
    return this.httpClient.post(this.url + "/employee/updateStatus/"+id,{
      headers: new HttpHeaders().set('Content-Type', 'application/json')

    });

    };

    }
  


