import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-people-details',
  templateUrl: './people-details.component.html',
  styleUrls: ['./people-details.component.css']
})
export class PeopleDetailsComponent {
  personDetails: any = {};
  moviesList: Array<string> = [];

  constructor(private http: HttpClient) { 
    this.personDetails = JSON.parse(localStorage.getItem("personDetails") || "{}");
    this.getMoviesList();
  }

  async getMoviesList(){
    (this.personDetails.films as Array<string>).forEach(movieURL=>{
      this.http.get(movieURL).subscribe((res:any)=>{
        if(res){
          const movieName: string = res.title;
          this.moviesList.push(movieName);
        }
      });
    })
  }

}
