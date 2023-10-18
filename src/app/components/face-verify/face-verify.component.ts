import { Component } from '@angular/core';
import { FaceRecognitionService } from 'src/app/services/face-recognition-service.service';

@Component({
  selector: 'app-face-verify',
  templateUrl: './face-verify.component.html',
  styleUrls: ['./face-verify.component.scss']
})
export class FaceVerifyComponent {

  constructor(private faceRecognitionService: FaceRecognitionService) {}

  runFaceRecognition() {
    this.faceRecognitionService.runFaceRecognition().subscribe(
      (response) => {
       console.log(response);
       
      },
      (error) => {
        console.error('Error calling the face recognition API:', error);
        // Handle the error scenario if needed
      }
    );
  }
}
