import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/model/user';
// import { User } from 'src/model/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  userArray: User[] =[];
  private apiServer = "http://localhost:3000";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  getUsers(): Promise<User[]>{

    this.httpClient.get("assets/user.json").subscribe((data: any) => {
      this.userArray = data;
      // console.log("hello" + this.userArray.length);
    });
    return Promise.resolve(this.userArray);

    // this.httpClient.get("./assets/user.json").subscribe((data: any )=> this.userArray = data);
    // return Promise.resolve(this.userArray);
  }

  getUsersData(){
    return this.httpClient.get(this.apiServer + '/user');
    // return this.httpClient.get(this.apiServer + '/addUser');
  }

  getJsonUser(){
    return this.httpClient.get(this.apiServer + '/addUser');
  }

  addUser(data: User){
    console.log(JSON.stringify(data));
    return this.httpClient.post<User>(this.apiServer + '/user/',  JSON.stringify(data), this.httpOptions);
  }
}
