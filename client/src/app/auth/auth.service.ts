import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environment/environment.dev";

@Injectable()
export class AuthService {

    private isAuthenticated: boolean = false;

    constructor(private http: HttpClient) { }

    public isRouteAuthenticated(): any {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            withCredentials: true //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
        };

        return new Promise((resolve) => {
            this.http.get(environment.apiUrl+'/authenticationStatus', httpOptions)
                .subscribe((response:any) => {
                    this.isAuthenticated=response.status;
                    resolve(this.isAuthenticated);
                });
        })
    }
}