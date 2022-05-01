import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

let peopleList: Array<any> = [];

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent {

  nextPageDataURL: string = "";
  prevPageDataURL: string = "";
  displayedColumns: string[] = ['name'];
  dataSource:any = [];

  constructor(private http: HttpClient) {
    this.getPeople("https://swapi.dev/api/people/");
   }

  ngOnInit(): void {
  }

  onPaginateChange(event:PageEvent){
    debugger;
    const previousPageIndex = event.previousPageIndex ? event.previousPageIndex : 0;
    const currentIndex: number = event.pageIndex*event.pageSize;
    // NEXT
    if(event.pageIndex > previousPageIndex){
      // CALL API
      if(currentIndex + 1 === event.length){
        this.getPeople(this.nextPageDataURL);
        setTimeout(()=>{
          this.dataSource = peopleList.slice(currentIndex,currentIndex + event.pageSize);
        });
      }
      // DATA ALREADY PRESENT
      else{

      }
    }
    // PREVIOUS
    else{
      this.dataSource = peopleList.slice(previousPageIndex*event.pageSize,currentIndex*event.pageSize);
    }
  }

  async getPeople(APIurl:string){
    this.http.get(APIurl).subscribe((res:any)=>{
      debugger;
      if(res.count > 0){
        (res.results as Array<any>).forEach(person=>{
          peopleList.push(person);
        });
        this.dataSource = peopleList;
        this.nextPageDataURL = res.next;
        this.prevPageDataURL = res.previous;
      }
    });
  }
}
