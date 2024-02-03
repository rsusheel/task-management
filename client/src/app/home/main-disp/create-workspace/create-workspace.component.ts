import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment.dev';
import { SharedService } from 'src/app/shared.service';
import { Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconSnackBarComponent } from 'src/app/lib/icon-snack-bar/icon-snack-bar.component';

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.css']
})
export class CreateWorkspaceComponent {
  globalStateValue: any;
  createWorkspaceForm!: FormGroup;
  formData: any;
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private sharedService: SharedService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) { 
      this.createWorkspaceForm = this.formBuilder.group({
        workspaceName: '',
        workspaceTagline: '',
        workspaceDescription: '',
      })
   }

  initializeForm() {
    this.sharedService.globalState$.subscribe((state) => {
      this.globalStateValue = state;
      this.createWorkspaceForm = this.formBuilder.group({
        workspaceName: '',
        workspaceTagline: '',
        workspaceDescription: '',
      })
    })
  }

  onCreateWorkspace() {
    const workspaceName: any = this.createWorkspaceForm.value.workspaceName;
    const workspaceTagline: any = this.createWorkspaceForm.value.workspaceTagline;
    const workspaceDescription: any = this.createWorkspaceForm.value.workspaceDescription;
    

    const body = new URLSearchParams();

    body.set('workspace_name', workspaceName);
    body.set('workspace_tagline', workspaceTagline);
    body.set('workspace_description', workspaceDescription);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    this.http.post(environment.apiUrl+'/workspace/create', body.toString(), {headers, withCredentials: true})
      .subscribe((response: any) => {
        let userInfo = this.sharedService.getGlobalState('userInfo');
        userInfo.push(response);
        let filterOptions = this.sharedService.getGlobalState('filterOptions');
        filterOptions = {...filterOptions, workspace_id: response.workspace_id, group_ids: response.groups[0].group_id};
        this.sharedService.setGlobalState('filterOptions', filterOptions);
        this.sharedService.setGlobalState('workspace', response);

        this.router.navigate(['/home'])

        // this._snackBar.open('Workspace created successfully!', 'Dismiss', {duration: 3000})
        this._snackBar.openFromComponent(IconSnackBarComponent, {
          data: {
            message: 'Workspace created successfully!',
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
