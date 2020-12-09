import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/model/book';
import { BookService } from 'src/service/bookService/book.service';
import { SharingDataService } from 'src/service/dataSharing/sharing-data.service';

@Component({
  selector: 'app-borrow-books',
  templateUrl: './borrow-books.component.html',
  styleUrls: ['./borrow-books.component.css']
})
export class BorrowBooksComponent implements OnInit {

  userId: number = 0;
  bookId: number = 0;
  books: Book[] = [];
  booksArray: Book[] = [];
  constructor(private bookService: BookService, private route: ActivatedRoute,
    private sharingDataService: SharingDataService, private router: Router,
    private location: Location) {
   }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];
    this.bookId = this.route.snapshot.params['bookId'];
    
    this.books  = this.bookService.getBookArray(this.sharingDataService.userId);
    this.getBooks()
  }

  viewDetails(bookId: number){
    this.router.navigate(['/view-detail', bookId]);
  }

  borrowBook(bookId: number){
    this.bookService.addBorrowedBook(this.sharingDataService.userId, bookId);
  }

  getBooks(): void {
    this.bookService.getBooks().subscribe((data: any) => {
      this.booksArray = data;
    })
  }

  goBack(): void {
    this.location.back();
  }
}
