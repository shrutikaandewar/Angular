import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { element } from 'protractor';
import { UserBorrowed } from 'src/model/userBorrowed';

import { Book } from '../../model/book';
// import { BOOKS } from '../model/mock-book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  bookArray: Book[] = [];
  data: any = {};
  private apiServer = "http://localhost:3000";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  
  constructor(private httpClient: HttpClient) {

  }

  getBooks() {
    return this.httpClient.get(this.apiServer + '/books');
  }

  addBook(book: Book) {
    console.log(JSON.stringify(book))
    return this.httpClient.post<Book>(this.apiServer + '/books/', JSON.stringify(book), this.httpOptions);
    // this.getBooks().then(books => {
    //   let maxIndex = books.length - 1;
    //   let bookWithMaxIndex = books[maxIndex];
    //   book.id = bookWithMaxIndex.id + 1;
    //   books.push(book);
    // }
    // );
  }

  getBookById(id: number){
    return this.httpClient.get(this.apiServer + '/books/' + id)
  }

  getBorrowerBookPerUser(id: number): any{
    return this.httpClient.get(this.apiServer + '/userBorrowed/' + id)
  }

  getBorrowerBook(): any{
    return this.httpClient.get(this.apiServer + '/userBorrowed/');
  }

  getBookArray(id: number): Book[]{
    let bookArray: Book[] = [];
    this.getBorrowerBookPerUser(id).subscribe((data: UserBorrowed) =>{
      data.bookIdArray.forEach( element => {
        this.getBookById(element).subscribe(
          book => {
            bookArray.push(book as Book);
            console.log(book);
          })
      })
    },(error: any) => {
      // console.error("error", error.status)
      bookArray = []
    });
    return bookArray;
  }

  addBorrowedBook(userId: number, bookId: number){
    let borrowed;
    let bookArray: number[] = [];
    
    this.getBorrowerBook().subscribe(
      (data: any) => {data.find((element: UserBorrowed) => {
        if (element.id !== userId) {
          console.log("inside if ");
          bookArray.push(bookId);
          borrowed = new  UserBorrowed(userId, bookArray);
          this.httpClient.post(this.apiServer + '/userBorrowed/', JSON.stringify(borrowed), this.httpOptions).subscribe();
          
        } else {
          console.log("inside else ")
          bookArray = element.bookIdArray;
          bookArray.push(bookId);
          console.log(bookArray)
          borrowed = new  UserBorrowed(userId, bookArray)
          console.log(JSON.stringify(borrowed))
          this.httpClient.put(this.apiServer + '/userBorrowed/' + userId, JSON.stringify(borrowed), this.httpOptions).subscribe();
        }
      });
      if (data.length === 0) {
        bookArray.push(bookId);
        borrowed = new  UserBorrowed(userId, bookArray);
        this.httpClient.post(this.apiServer + '/userBorrowed/', JSON.stringify(borrowed), this.httpOptions).subscribe();
      }
    }
      
      );
  }

  // getBook(id: number): Promise<Book | undefined> {
  //   console.log("Id : " + id);
  //   return this.getBooks().then(books => books
  //     .find(book => book.id === id));
  // }

   // getBooks(): Promise<Book[]> {
  //   this.httpClient.get(this.apiServer + '/books').subscribe((data: any) => {
  //     this.bookArray = data;
  //   });
  //   return Promise.resolve(this.bookArray);

    
  //   // This return type for mock-book json object
  //   //  return Promise.resolve(BOOKS);
  // }

  // deleteBook(id: number): void {
  //   this.getBooks().then(books => {
  //     let book: any = books.find(ob => ob.id === id);
  //     let bookIndex = books.indexOf(book);
  //     books.splice(bookIndex, 1);
  //   }
  //   );
  // }
} 