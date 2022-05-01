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
  displayedColumns: string[] = ['name', 'markAsFavourite'];
  peopleList: Array<any> = [];
  dataSource:any = [];
  favouritePeople: Array<any> = [];

  constructor(private http: HttpClient) {
    debugger
    this.favouritePeople = JSON.parse(localStorage.getItem("favouritePeople") || "[]");
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

  markAsFavourite(element:any){
    debugger;
    // ADD TO LIST IF NOT ALREADY MARKED AS FAVOURITE
    if(!this.favouritePeople.some(person=>{
      return person.name === element.name;
    })){
      this.favouritePeople.push(element);
    }
    // IF ALREADY MARKED AS FAVOURITE
    else{
      const index = this.favouritePeople.findIndex(person=>{
        return element.name === person.name;
      })
      this.favouritePeople.splice(index,1);
    }
    localStorage.setItem("favouritePeople",JSON.stringify(this.favouritePeople));
  }

  isFavourite(element:any): boolean{
    return this.favouritePeople.some(person=>{
      return person.name === element.name;
    })
  }
}
