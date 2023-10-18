import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaceRecognitionService {
private backendUrl = 'http://localhost:5000/run_face_recognition';

  constructor(private http: HttpClient) {}

  runFaceRecognition(): Observable<any> {
    return this.http.get<any>(this.backendUrl);
  }
}
