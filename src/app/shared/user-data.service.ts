import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private email: string | undefined;

  setEmail(email: string) {
    this.email = email;
  }
  getEmail() {
    return this.email;
  }

  constructor() { }
}
