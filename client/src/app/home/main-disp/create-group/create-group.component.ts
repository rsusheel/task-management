import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment.dev';
import { SharedService } from 'src/app/shared.service';
import { Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconSnackBarComponent } from 'src/app/lib/icon-snack-bar/icon-snack-bar.component';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent {
  globalStateValue: any;
  createGroupForm!: FormGroup;
  formData: any;
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private sharedService: SharedService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) { 
      this.createGroupForm = this.formBuilder.group({
        groupName: '',
        groupDescription: '',
        workspace: {value: this.sharedService.getGlobalState('workspace')?.workspace_id, disabled: true},
      })
   }

  initializeForm() {
    this.sharedService.globalState$.subscribe((state) => {
      this.globalStateValue = state;
      this.createGroupForm = this.formBuilder.group({
        groupName: '',
        groupDescription: '',
        workspace: [{value: state.workspace?.workspace_id, disabled: true}],
      })
    })
  }

  onCreateGroup() {
    const groupName: any = this.createGroupForm.value.groupName;
    const groupDescription: any = this.createGroupForm.value.groupDescription;
    const workspaceId: any = this.sharedService.getGlobalState('workspace').workspace_id;

    console.log(workspaceId)

    const body = new URLSearchParams();

    body.set('group_name', groupName);
    body.set('group_description', groupDescription);
    body.set('workspace_id', workspaceId);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    this.http.post(environment.apiUrl+'/group/create', body.toString(), {headers, withCredentials: true})
      .subscribe((response) => {
        let userInfo = this.sharedService.getGlobalState('userInfo');
        for(let i=0; i<userInfo.length; i++){
          if(userInfo[i].workspace_id==this.sharedService.getGlobalState('workspace').workspace_id){
            let groups = userInfo[i].groups;
            groups.push(response);
            break;
          }
        }
        this.sharedService.handleWorkspaceChange(this.sharedService.getGlobalState('workspace').workspace_id);
        this.router.navigate(['/home'])
        this._snackBar.openFromComponent(IconSnackBarComponent, {
          data: {
            message: `Group created successfully!`,
            icon: 'check_circle'
          },
          duration: 3000
        })
      });
  }

  ngOnInit() {
    this.initializeForm();
  }
}
