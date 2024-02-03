import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared.service';
import { ManageInvitesComponent } from '../manage-invites/manage-invites.component';

@Component({
  selector: 'app-manage-sent-invites',
  templateUrl: './manage-sent-invites.component.html',
  styleUrls: ['./manage-sent-invites.component.css']
})
export class ManageSentInvitesComponent {

  private globalStateSubscription: Subscription = new Subscription();
  inviteDetails: any;

  constructor(
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<ManageSentInvitesComponent>,
    private dialog: MatDialog,
  ) { }

  onCloseDialog() {
    this.dialogRef.close();
    this.dialog.open(ManageInvitesComponent);
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
