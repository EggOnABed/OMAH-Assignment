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
    this.getPeople("https://swapi.dev/api/people/").then(()=>{
      this.dataSource = peopleList;
    });
   }

  ngOnInit(): void {
  }

  onPaginateChange(event:PageEvent){
    debugger;
    const previousPageIndex = event.previousPageIndex ? event.previousPageIndex : 0;
    // NEXT
    if(event.pageIndex > previousPageIndex){
      this.getPeople(this.nextPageDataURL).then(()=>{
        const startIndex: number = event.pageIndex*event.pageSize;
        this.dataSource = peopleList.slice(startIndex,startIndex + event.pageSize);
      });
    }
    // PREVIOUS
    else{
      this.dataSource = peopleList.slice()
    }
  }

  async getPeople(APIurl:string){
    this.http.get(APIurl).subscribe((res:any)=>{
      debugger;
      if(res.count > 0){
        (res.results as Array<any>).forEach(person=>{
          peopleList.push(person);
        });
        this.nextPageDataURL = res.next;
        this.prevPageDataURL = res.previous;
      }
    })
  }

}
