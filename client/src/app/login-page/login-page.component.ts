import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environment/environment.dev';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  loginForm: FormGroup

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      username: '',
      password: '',
    })
   }

  

  onSubmit() {
    const username: any = this.loginForm.value.username;
    const password: any = this.loginForm.value.password;

    const body = new URLSearchParams();

    body.set('username', username);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    this.http.post(environment.apiUrl+'/login',body.toString(),{headers, withCredentials: true})
      .subscribe((response) => {
        this.router.navigate(['/home']);
      });

    this.loginForm.reset();
    
  }
}
