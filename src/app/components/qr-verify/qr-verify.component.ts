import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; 
import 'firebase/firestore';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeResult,
  NgxScannerQrcodeService,
  NgxScannerQrcodeComponent,
  ScannerQRCodeSelectedFiles,
} from 'ngx-scanner-qrcode';
import { SpinnerService } from 'src/app/services/spinner.service';

interface BackendResponse {
  message: string;
  status: string;
  getDetails: any;

}

var config = {
  apiKey: "AIzaSyBAWvECNptzshibOawhEX5b0K36tM9REGA",
  authDomain: "inseatfood-auth.firebaseapp.com",
  projectId: "inseatfood-auth",
  storageBucket: "inseatfood-auth.appspot.com",
  messagingSenderId: "337089721925",
  appId: "1:337089721925:web:4299653759e4ea7524552c",
  measurementId: "G-YS7MJ2MG7J"
}

@Component({
  selector: 'app-qr-verify',
  templateUrl: './qr-verify.component.html',
  styleUrls: ['./qr-verify.component.scss']
})
export class QrVerifyComponent {

  reCaptchaVerifier: any;

  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth,
      },
    },
  };

  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];

  @ViewChild('action') action!: NgxScannerQrcodeComponent;
  scannedData: any;
  userMobile: any;

  constructor(private qrcode: NgxScannerQrcodeService, private http: HttpClient ,     
    private toastr: ToastrService,
    private router: Router,
    private spinnerService: SpinnerService,
    ) {}

  ngAfterViewInit(): void {
    this.action.isReady.subscribe((res: any) => {
      // this.handle(this.action, 'start');
    });
  }

  public onEvent(e: ScannerQRCodeResult[], action?: any) {
    e && action && action.pause();
    // console.log(e[0].value);
    this.scannedData = e[0].value
    console.log(this.scannedData);
    
    this.sendScannedDataToBackend(this.scannedData);

  }

  private sendScannedDataToBackend(scannedData: string): void {
    const backendUrl = 'http://localhost:5000/receive_qr_data'; // Replace with your actual backend URL

    this.http.post<BackendResponse>(backendUrl, scannedData, { headers: { 'Content-Type': 'text/plain' } })
      .subscribe(
        (response) => {
          console.log('Backend response:', response);
          console.log(response);
          
          console.log(response.getDetails.mobile);
          
          this.userMobile = response.getDetails.mobile

          console.log(this.userMobile);
          
          this.spinnerService.showSpinner();

          
          

          if (response.message == "Details verified successfully"){
            const toastConfig: Partial<IndividualConfig> = {
              timeOut: 1500,
              closeButton: true,
              progressBar: true,
              progressAnimation: 'decreasing'
            };
            this.toastr.error(response.message, 'success', toastConfig);
            // this.spinnerService.hideSpinner();
            // console.log('Authentication failed:', response.debug);

            // console.log(response.message);

            this.reCaptchaVerifier = new firebase.auth.RecaptchaVerifier(
              'sign-in-button',
              {
                size: 'invisible',
              }
            );
            firebase.auth().signInWithPhoneNumber('+91'+this.userMobile, this.reCaptchaVerifier).then((confirmationResult)=>{
              localStorage.setItem(
                'verificationId',
                JSON.stringify(confirmationResult.verificationId)
              );
              this.spinnerService.hideSpinner();
              this.router.navigate(['/otp_verify'])
            }).catch((error) =>{
              alert(error.message)
              setTimeout(() =>{
                window.location.reload()
              }, 5000);
            })
  

            // this.router.navigate(['/otp_verify']);

          }
          else{
            const toastConfig: Partial<IndividualConfig> = {
              timeOut: 1500,
              closeButton: true,
              progressBar: true,
              progressAnimation: 'decreasing'
            };
            this.toastr.error(response.message, 'Error', toastConfig);
            // this.spinnerService.hideSpinner();
            // console.log('Authentication failed:', response.debug);
            console.log(response.message);
          }
          
        },
        (error) => {
          console.error('Error sending data to backend:', error);
        }
      );
  }

  public onSelects(files: any) {
    this.qrcode.loadFiles(files, 0.5).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      this.qrCodeResult = res;
      console.log(this.qrCodeResult);
      
    });
  }
  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      const device = devices.find((f) =>
        /back|rear|environment/gi.test(f.label)
      ); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    };

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe(
        (r: any) => 
        // console.log(fn, r),
        alert
      );
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }

  ngOnInit() {
    firebase.initializeApp(config)
  }

}
