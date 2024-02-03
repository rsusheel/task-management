import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconSnackBarComponent } from 'src/app/lib/icon-snack-bar/icon-snack-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterOptionsComponent } from '../filter-options/filter-options.component';

@Component({
  selector: 'app-workgroup-list',
  templateUrl: './workgroup-list.component.html',
  styleUrls: ['./workgroup-list.component.css']
})
export class WorkgroupListComponent {
  globalStateValue: any;
  defaultValue: any;
  groupValue: any = 'All';
  private userInfoSubscription: Subscription = new Subscription();

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  setWorkgroupList(workspace: any) {
    this.userInfoSubscription = this.sharedService.globalState$.subscribe((state) => {
      for(let i=0; i<state.userInfo.length; i++){
        if(state.userInfo[i].workspace_id==workspace.workspace_id){
          this.globalStateValue = state.userInfo[i];
          // this.defaultValue='All';
          return;
        }
      }
    });
  }

  onGroupChange(event: any) {
    try {
      if(event.target.value=='+'){
        this.router.navigate(['/home/group/create'])
        this.cdr.detectChanges();
        return;
      }
  
      let filterOptions = this.sharedService.getGlobalState('filterOptions');
      if(event.target.value == "All"){
        let groupIds = [];
        for(let i=0; i<this.globalStateValue.groups.length; i++){
          groupIds.push(this.globalStateValue.groups[i].group_id);
        }
        filterOptions = {...filterOptions, group_ids: groupIds};
      } else {
        filterOptions = {...filterOptions, group_ids: [Number(event.target.value)]};
      }
      this.sharedService.setGlobalState('filterOptions', filterOptions)
      this.sharedService.handleFilterChange(event.target.value);
      this.groupValue=event.target.value;
      this.router.navigate(['/home']);
      for(const item of this.globalStateValue.groups) {
        if(event.target.value=='All'){
          this._snackBar.openFromComponent(IconSnackBarComponent, {
            data: {
              message: `All groups`,
              icon: 'swap_vert'
            },
            duration: 3000
          })
        } else if(item.group_id==event.target.value) {
          this._snackBar.openFromComponent(IconSnackBarComponent, {
            data: {
              message: `Switched to <i>${item.group_name}</i> group`,
              icon: 'swap_vert'
            },
            duration: 3000
          })
        }
      }
    } finally {
      this.ngZone.run(() => {
        this.defaultValue = this.groupValue
      })
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(FilterOptionsComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnInit() {
    this.sharedService.getWorkspaceChangeObservable().subscribe((workspace) => {
      this.setWorkgroupList(workspace);
      this.defaultValue='All';
    })
  }

  ngOnDestroy() {
    if(this.userInfoSubscription){
      this.userInfoSubscription.unsubscribe();
    }
  }
}
