import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SharedService } from 'src/app/shared.service';
import { environment } from 'src/environment/environment.dev';

@Component({
  selector: 'app-invite-dialog',
  templateUrl: './invite-dialog.component.html',
  styleUrls: ['./invite-dialog.component.css']
})
export class InviteDialogComponent {

  inviteForm: any;
  outerDialogRef: any;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private sharedService: SharedService,
  ) {
    this.inviteForm = this.formBuilder.group({
      inviteUser: '', 
    })
  }

  onInviteUser() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams();

    const inviteUser: any = this.inviteForm.get('inviteUser')?.value;
    body.set('requestee_id', inviteUser)

    const workspace_id = this.sharedService.getGlobalState('workspace').workspace_id
    body.set('workspace_id', workspace_id)

    this.http.post(environment.apiUrl+'/invite/sendInvite', body.toString(), {headers, withCredentials: true})
      .subscribe(response => {
        this.sharedService.setGlobalState('invite', response)
      });
  }

  ngOnInit() {
    this.inviteForm = this.formBuilder.group({
      inviteUser: this.inviteForm.invite_user,
    })
  }
  
}
