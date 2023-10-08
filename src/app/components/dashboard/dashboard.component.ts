import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  dateTime=new Date();
  currentTime: any;
  redirectURL: string | undefined;

  constructor() { }

  ngOnInit(): void {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  
  }

  about(){
    this.redirectURL = "https://eci.gov.in/";
    window.location.replace(this.redirectURL!);
  }
}
