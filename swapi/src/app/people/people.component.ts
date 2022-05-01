import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) {
    this.favouritePeople = JSON.parse(localStorage.getItem("favouritePeople") || "[]");
    this.getPeople("https://swapi.dev/api/people/",true);
   }

  // PAGINATION LOGIC
  onPaginateChange(event:PageEvent){
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

  // GET PEOPLE API
  async getPeople(APIurl:string, bindData:boolean = false){
    this.http.get(APIurl).subscribe((res:any)=>{
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

  // MARK/UNMARK A PERSON AS FAVOURITE
  markAsFavourite(element:any){
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

  // CHECK IF ELEMENT IS MARKED AS FAVOURITE
  isFavourite(element:any): boolean{
    return this.favouritePeople.some(person=>{
      return person.name === element.name;
    })
  }

  getPersonDetails(element:any){
    localStorage.setItem("personDetails",JSON.stringify(element));
    this.router.navigate(["/people-details"]);
  }
}
