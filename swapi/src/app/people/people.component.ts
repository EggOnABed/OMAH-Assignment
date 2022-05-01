import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent {

  nextPageDataURL: string = "";
  prevPageDataURL: string = "";
  displayedColumns: string[] = ['name'];
  peopleList: Array<any> = [];
  dataSource:any = [];

  constructor(private http: HttpClient) {
    this.getPeople("https://swapi.dev/api/people/",true);
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
          this.dataSource = this.peopleList.slice(currentIndex,currentIndex + event.pageSize);
        },1000);
      }
      // DATA ALREADY PRESENT
      else{
        this.dataSource = this.peopleList.slice(currentIndex,currentIndex + event.pageSize);
      }
    }
    // PREVIOUS
    else{
      this.dataSource = this.peopleList.slice(currentIndex,previousPageIndex*event.pageSize);
    }
  }

  async getPeople(APIurl:string, bindData:boolean = false){
    this.http.get(APIurl).subscribe((res:any)=>{
      debugger;
      if(res.count > 0){
        (res.results as Array<any>).forEach(person=>{
          this.peopleList.push(person);
        });
        if(bindData) this.dataSource = this.peopleList;
        this.nextPageDataURL = res.next;
        this.prevPageDataURL = res.previous;
        if(!this.nextPageDataURL){
          
        }
      }
    });
  }
}
