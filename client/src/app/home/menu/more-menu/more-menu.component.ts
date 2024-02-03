import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ManageInvitesComponent } from '../../invite/manage-invites/manage-invites.component';
import { InviteDialogComponent } from '../../invite/invite-dialog/invite-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment.dev';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
import { MembersListComponent } from '../members-list/members-list.component';
import { ManageWorkspaceComponent } from '../manage-workspace/manage-workspace.component';

@Component({
  selector: 'app-more-menu',
  templateUrl: './more-menu.component.html',
  styleUrls: ['./more-menu.component.css']
})
export class MoreMenuComponent {
  globalState: any;

  constructor(
    private dialogRef: MatDialogRef<MoreMenuComponent>,
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService,
  ) { }

  openManageWorkspace() {
    this.dialogRef.close()
    this.dialog.open(ManageWorkspaceComponent)
  }

  openMembersList() {
    this.dialogRef.close()
    this.dialog.open(MembersListComponent)
  }

  openManageInvites() {
    this.dialogRef.close()
    this.dialog.open(ManageInvitesComponent)
  }

  openInviteUser() {
    this.dialogRef.close()
    this.dialog.open(InviteDialogComponent)
  }

  onLogOut(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    
    this.http.get(environment.apiUrl+'/logout', {headers, withCredentials: true})
      .subscribe((response) => {
        this.router.navigate(['/login']);
      });
    
    window.location.reload();
  }

  ngOnInit() {
    this.sharedService.globalState$.subscribe((state) => {
      this.globalState = state;
    })
  }
}
