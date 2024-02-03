import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SharedService } from './shared.service';
import { environment } from 'src/environment/environment.dev';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateResolver implements Resolve<any> {
  constructor(
    private sharedService: SharedService,
    private http: HttpClient
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    // Set the global state here based on route data or any other criteria
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    this.http
      .get(`${environment.apiUrl}/lookup/all`, {
        headers,
        withCredentials: true,
      })
      .subscribe((response) => {
        this.sharedService.setGlobalState('data', response);
      });

    this.http
      .get(`${environment.apiUrl}/workspace/details`, {
        headers,
        withCredentials: true,
      })
      .subscribe((response) => {
        this.sharedService.setGlobalState('userInfo', response);
      });
    
    this.http
      .get(`${environment.apiUrl}/userPreference`, {
        headers,
        withCredentials: true,
      })
      .subscribe((response) => {
        this.sharedService.setGlobalState('userPreference', response);
      })

    this.http
      .get(`${environment.apiUrl}/userPreference/filterOptions`, {
        headers,
        withCredentials: true,
      })
      .subscribe((response) => {
        this.sharedService.setGlobalState('filterOptions', response)
      });
    
    this.http
      .get(`${environment.apiUrl}/workspace`, {
        headers,
        withCredentials: true,
      })
      .subscribe((response) => {
        this.sharedService.setGlobalState('workspace', response);
      });

    this.http
      .get(`${environment.apiUrl}/invite`, {
        headers,
        withCredentials: true,
      })
      .subscribe((response) => {
        this.sharedService.setGlobalState('invite', response);
      })

    this.http
      .get(`${environment.apiUrl}/task`, {
        headers,
        withCredentials: true
      })
      .subscribe((response) => {
        this.sharedService.setGlobalState('tasks', response);
      })
  }
}