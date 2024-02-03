import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment.dev';
import { SharedService } from 'src/app/shared.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconSnackBarComponent } from 'src/app/lib/icon-snack-bar/icon-snack-bar.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MoreMenuComponent } from '../menu/more-menu/more-menu.component';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  globalStateValue: any;
  selectedWorkspace: any;
  defaultWorkspace: any;
  workspace: any;
  workspaceObj: any;
  shouldUpdateState: any = true;
  userId: any;
  
  private globalStateSubscription: Subscription = new Subscription();

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { };

  onWorkspaceChange(event: any): void {
    try{
      if(event.target.value=='+'){
        this.router.navigate(['/home/workspace/create']);
        const test=this.sharedService.getGlobalState('workspace');
        this.selectedWorkspace = test.workspace_id;
        this.cdr.detectChanges();
        return;
      }
      
      this.selectedWorkspace = event.target.value;
      this.workspace = event.target.value;
      let filterOptions = this.sharedService.getGlobalState('filterOptions');
      const workspaces = this.sharedService.getGlobalState('userInfo');
      let groupIds: any = [];
      for(let i=0; i<workspaces.length; i++){
        if(workspaces[i].workspace_id==event.target.value){
          for(let j=0; j<workspaces[i].groups.length; j++){
            groupIds.push(workspaces[i].groups[j].group_id);
          }
          break;
        }
      }
      filterOptions = {...filterOptions, workspace_id: this.selectedWorkspace, group_ids: groupIds};

      this.sharedService.setGlobalState('filterOptions', filterOptions);
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });
      this.http.get(`${environment.apiUrl}/workspace/`+this.selectedWorkspace, {
        headers,
        withCredentials: true,
      }).subscribe((response) => {
        this.workspaceObj = response;
        this.sharedService.setGlobalState('workspace', response);
        this.sharedService.handleWorkspaceChange(this.workspaceObj);
      })
  
      this.sharedService.handleFilterChange('test');
  
      this.router.navigate(['/home']);
      for(const item of this.globalStateValue){
        if(item.workspace_id==event.target.value){
          const message = `Switched to '${item.workspace_name}' workspace`;
          // this._snackBar.open(message, 'Dismiss', {duration: 3000})
          this._snackBar.openFromComponent(IconSnackBarComponent, {
            data: {
              message: `Switched to <i>${item.workspace_name}</i> workspace`,
              icon: 'swap_horiz'
            },
            duration: 3000
          })
        }
      }
    } finally {
      this.ngZone.run(()=>{
        this.selectedWorkspace=this.workspace
      })
    }
  }

  onSetWorkspaceDefault() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const workspace = this.sharedService.getGlobalState('workspace').workspace_id;
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
    this.workspace = workspace;
    this.router.navigate(['/home'])
  }

  onOpenMenu() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top:  '55px',
      right: '5px'
    };
    dialogConfig.backdropClass='more-menu-backdrop'
    dialogConfig.panelClass='more-menu-panel'
    dialogConfig.width='250px'
    this.dialog.open(MoreMenuComponent, dialogConfig)
  }

  ngOnInit() {
    this.globalStateSubscription = this.sharedService.globalState$.subscribe((state) => {
      if(this.shouldUpdateState){
        // Update the component's property when the state changes
        this.globalStateValue = state.userInfo; // Replace with the appropriate key from your state
        this.userId = state.userPreference?.[0].user_id;
        
        if(state.userInfo && state.userPreference && state.filterOptions && state.workspace){ // Once the state is set
          this.shouldUpdateState = false
          console.log(state)
          this.defaultWorkspace = state.userPreference[0].default_workspace_id;

          this.sharedService.handleWorkspaceChange(state.workspace);

          let filterOptions = this.sharedService.getGlobalState('filterOptions');
          filterOptions = {...filterOptions, workspace_id: this.defaultWorkspace};

          this.sharedService.setGlobalState('filterOptions', filterOptions);
          this.sharedService.setGlobalState('workspace', state.workspace);

          this.selectedWorkspace=this.defaultWorkspace;
          this.workspace = this.defaultWorkspace;

          this.sharedService.handleFilterChange('1');
          
          this.sharedService.setGlobalState('refreshCount', 0);
        }
      }
    });
  }

  ngOnDestroy() {
    if(this.globalStateSubscription){
      this.globalStateSubscription.unsubscribe();
    }
  }
}
