import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatapassService {


	PHP_USER_SERVER = "https://zenanvibe.com/sirraji_billing/auth_user";

	private baseUrl = 'http://localhost:5000';

  constructor(private httpClient: HttpClient) {}

	store_user_data(users:any){
		let userdata = JSON.stringify(users)
		console.log(userdata);
		return this.httpClient.post<any>(`${this.PHP_USER_SERVER}/user_reg.php`, userdata);
	}

	openMapCaptureImage(captureData: any) {
		return this.httpClient.post(`${this.baseUrl}/open_map_capture_image`, captureData);
	  }

}
