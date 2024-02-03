import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs/internal/Subscription';
import { IconSnackBarComponent } from 'src/app/lib/icon-snack-bar/icon-snack-bar.component';
import { SharedService } from 'src/app/shared.service';
import { environment } from 'src/environment/environment.dev';
import { EditWorkspaceComponent } from '../edit-workspace/edit-workspace.component';

@Component({
  selector: 'app-manage-workspace',
  templateUrl: './manage-workspace.component.html',
  styleUrls: ['./manage-workspace.component.css']
})
export class ManageWorkspaceComponent {
  
  private globalStateSubscription: Subscription = new Subscription();
  globalStateValue: any;
  userId: any;
  defaultWorkspace: any;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ManageWorkspaceComponent>,
    private sharedService: SharedService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) { }

  onCloseDialog() {
    this.dialogRef.close()
  }

  onClickManage(workspace_id: any) {
    this.dialogRef.close();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      'workspace_id': workspace_id
    }
    this.dialog.open(EditWorkspaceComponent, dialogConfig)
  }

  checkAdmin(item: any) {
    return item.admin_users.some((user: any) => user.user_id === this.userId)
  }

  onSetWorkspaceDefault(workspace: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    this.http.post(environment.apiUrl+'/userPreference/update/workspace/'+workspace, null, {headers, withCredentials: true})
      .subscribe((response) => {})
    for(const item of this.globalStateValue){
      if(item.workspace_id==workspace){
        const message = `Switched to '${item.workspace_name}' workspace`;
        // this._snackBar.open(message, 'Dismiss', {duration: 3000})
        this._snackBar.openFromComponent(IconSnackBarComponent, {
          data: {
            message: `<i>${item.workspace_name}</i> set to default workspace`,
            icon: 'check_circle'
          },
          duration: 3000
        })
      }
    }
    this.defaultWorkspace = workspace;
  }

  ngOnInit() {
    this.globalStateSubscription = this.sharedService.globalState$.subscribe((state) => {
      this.globalStateValue = state.userInfo;
      this.userId = state.userPreference[0].user_id;
      this.defaultWorkspace = state.userPreference[0].default_workspace_id;
    });
  }
}
