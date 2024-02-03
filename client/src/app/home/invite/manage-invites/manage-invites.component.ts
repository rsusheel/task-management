import { Component, Inject } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment.dev';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ManageSentInvitesComponent } from '../manage-sent-invites/manage-sent-invites.component';

@Component({
  selector: 'app-manage-invites',
  templateUrl: './manage-invites.component.html',
  styleUrls: ['./manage-invites.component.css']
})
export class ManageInvitesComponent {

  private globalStateSubscription: Subscription = new Subscription();
  inviteDetails: any;
  outerDialogRef: any;

  constructor(
    private sharedService: SharedService,
    private http: HttpClient,
    private dialogRef: MatDialogRef<ManageInvitesComponent>,
    private dialog: MatDialog,
  ) { }

  onAcceptInvite(invite_id: any, workspace_id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams();

    body.set('workspace_id', workspace_id)
    body.set('invite_id', invite_id)

    this.http.post(environment.apiUrl+'/invite/acceptInvite', body.toString(),{headers, withCredentials: true})
      .subscribe(response => {
        this.sharedService.setGlobalState('invite', response)
        console.log(this.sharedService.getGlobalState('invite'))
      });
  }

  onRejectInvite() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    this.http.post(environment.apiUrl+'/invite/rejectInvite', {headers, withCredentials: true})
      .subscribe(response => {
        this.sharedService.setGlobalState('invite', response)
      });
  }

  onCloseDialog() {
    this.dialogRef.close()
  }

  openSentInviteDialog() {
    this.dialogRef.close();
    this.dialog.open(ManageSentInvitesComponent)
  }

  openInviteHistory() {
    
  }

  ngOnInit() {
    this.globalStateSubscription = this.sharedService.globalState$.subscribe((state) => {
      this.inviteDetails = state.invite;
    })
  }

  ngOnDestroy() {
    if(this.globalStateSubscription){
      this.globalStateSubscription.unsubscribe();
    }
  }
}
