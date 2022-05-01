import { Component } from '@angular/core';

@Component({
  selector: 'app-people-details',
  templateUrl: './people-details.component.html',
  styleUrls: ['./people-details.component.css']
})
export class PeopleDetailsComponent {
  personDetails: any = {};

  constructor() { 
    debugger
    this.personDetails = JSON.parse(localStorage.getItem("personDetails") || "{}");
  }

}
