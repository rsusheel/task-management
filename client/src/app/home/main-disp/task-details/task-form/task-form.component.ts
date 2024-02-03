import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment.dev';
import { SharedService } from 'src/app/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { dateToStr, strToDate } from 'src/app/lib/dateTransform';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconSnackBarComponent } from 'src/app/lib/icon-snack-bar/icon-snack-bar.component';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit{
  
  globalStateValue: any;
  taskStateValue: any;
  groupList: any;
  taskList: any;
  teamList: any;

  strToDate: any = strToDate;

  taskForm!: FormGroup;
  formData: any;

  targetDatetime: any;

  toggleClass: any = {
    taskState: false,
    holdReason: false,
    cancelReason: false,
    taskImportance: false,
    referenceTask: false,
    targetDatetime: false,
    groupName: false,
    assignedTo: false,
    taskName: false,
    taskDescription: false,
    addComment: false,
  }
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) { 
      this.taskForm = this.formBuilder.group({

        // Task details from task_details table
        taskNumber: {value: '', disabled: true},
        taskName: '',
        taskState: '',
        taskDescription: '',
        holdStatus: '',
        holdReason: '',
        cancelStatus: '',
        cancelReason: '',
        taskImportance: '',
        referenceTask: {value: '', disabled: true},

        lastComment: {value: '', disabled: true},
        addComment: '',
        hasSubTask: {value: '', disabled: true},
        subTaskCount: {value: '', disabled: true},

        // Workspace details from workspace_details table
        workspaceName: {value: '', disabled: true},

        // Group details from group_details table
        groupName: {value: '', disabled: true},

        assignedTo: {value: '', disabled: false},

        // Sub task details from sub_task_details table
        subTasks: '',
        dateTest: {value: new Date(), disabled: false}

      })
   }

  initializeForm() {

    for (const key in this.toggleClass){
      this.toggleClass[key]=false;
    }

    this.taskForm = this.formBuilder.group({

      // Task details from task_details table
      taskNumber: {value: this.formData.task_number, disabled: true},
      taskName: [this.formData.task_name],
      taskState: [this.formData.task_state],
      taskDescription: [this.formData.task_description],
      holdStatus: {value: this.formData.hold_status, disabled: true},
      holdReason: {value: this.formData.hold_reason, disabled: true},
      cancelStatus: {value: this.formData.cancel_status, disabled: true},
      cancelReason: {value: this.formData.cancel_reason, disabled: true},
      taskImportance: [this.formData.task_importance],
      referenceTask: {value: this.formData.reference_task, disabled: false},

      lastComment: {value: [this.formData.last_comment], disabled: true},
      addComment: '',
      hasSubTask: {value: this.formData.has_sub_task, disabled: true},
      subTaskCount: {value: this.formData.sub_task_count, disabled: true},

      // Workspace details from workspace_details table
      workspaceName: [{value: this.formData.workspace_name, disabled: true}],

      // Group details from group_details table
      groupName: [{value: this.formData.task_group_id, disabled: false}],

      assignedTo: {value: this.formData.assigned_to.user_id, disabled: false},

      // Sub task details from sub_task_details table
      subTasks: [this.formData.sub_tasks],
      dateTest: {value: new Date(), disabled: false}
    });

    if(!this.taskForm.get('holdStatus')?.value) {
      this.taskForm.get('holdReason')?.disable();
    }

    if(!this.taskForm.get('cancelStatus')?.value) {
      this.taskForm.get('cancelReason')?.disable();
    }

    // Checks the current task state and renders the task state based on current state.
    switch(this.taskForm.get('taskState')?.value) {
      case 'Created':
        this.taskStateValue.task_states = ['Created','In Progress', 'On Hold', 'Canceled'];
        break;
      
      case 'In Progress':
        this.taskStateValue.task_states = ['In Progress', 'On Hold', 'Completed', 'Canceled'];
        break;
      
      case 'On Hold':
        this.taskForm.get('holdStatus')?.disable();
        this.taskForm.get('holdReason')?.enable();
        this.taskStateValue.task_states = ['In Progress', 'On Hold', 'Completed', 'Canceled'];
        break;
      
      case 'Completed':
        this.taskStateValue.task_states = ['Completed', 'Re-opened', 'Closed'];
        break;

      case 'Re-opened':
        this.taskStateValue.task_states = ['Re-opened', 'In Progress', 'On Hold', 'Canceled'];
        break;

      case 'Canceled':
        this.taskForm.get('cancelStatus')?.disable();
        this.taskForm.get('cancelReason')?.enable();
        this.taskStateValue.task_states = ['Canceled', 'Re-opened'];
        break;

      case 'Closed':
        this.taskStateValue.task_states = ['Closed', 'Re-opened'];
        break;
    }
  }


  onSaveTask() {

    const targetDatetime = this.targetDatetime;

    const body = new URLSearchParams();

    if(this.taskForm.get('taskState')?.value != this.formData.task_state) {
      const taskState: any = this.taskForm.get('taskState')?.value;
      body.set('task_state', taskState);
    }
    
    if(this.taskForm.get('taskName')?.value != this.formData.task_name) {
      const taskName: any = this.taskForm.get('taskName')?.value;
      body.set('task_name', taskName);
    }

    if(this.taskForm.get('taskDescription')?.value != this.formData.task_description) {
      const taskDescription: any = this.taskForm.get('taskDescription')?.value;
      body.set('task_description', taskDescription);
    }

    if(this.taskForm.get('holdStatus')?.value != this.formData.hold_status) {
      const holdStatus: any = this.taskForm.get('holdStatus')?.value;
      body.set('hold_status', holdStatus);
    }

    if(this.taskForm.get('holdReason')?.value != this.formData.hold_reason) {
      const holdReason: any = this.taskForm.get('holdReason')?.value;
      body.set('hold_reason', holdReason);
    }

    if(this.taskForm.get('cancelStatus')?.value != this.formData.cancel_status) {
      const cancelStatus: any = this.taskForm.get('cancelStatus')?.value;
      body.set('cancel_status', cancelStatus);
    }

    if(this.taskForm.get('cancelReason')?.value != this.formData.cancel_reason) {
      const cancelReason: any = this.taskForm.get('cancelReason')?.value;
      body.set('cancel_reason', cancelReason);
    }

    if(this.taskForm.get('taskImportance')?.value != this.formData.task_importance) {
      const taskImportance: any = this.taskForm.get('taskImportance')?.value;
      body.set('task_importance', taskImportance);
    }
    
    if(this.taskForm.get('referenceTask')?.value != this.formData.reference_task) {
      const referenceTask: any = this.taskForm.get('referenceTask')?.value;
      body.set('reference_task', referenceTask);
    }

    if(this.taskForm.get('groupName')?.value != this.formData.task_group_id) {
      const groupName: any = this.taskForm.get('groupName')?.value;
      body.set('task_group_id', groupName);
    }

    if(this.taskForm.get('assignedTo')?.value != this.formData.assigned_to) {
      const assignedTo: any = this.taskForm.get('assignedTo')?.value;
      body.set('assigned_to', assignedTo);
    }

    if(targetDatetime != this.formData.target_datetime) {
      console.log(targetDatetime)
      console.log(this.formData.target_datetime)
      body.set('target_datetime', targetDatetime);
    }

    if(this.taskForm.get('taskState')?.value != this.formData.task_state && this.taskForm.get('taskState')?.value == 'Completed') {
      const completionDatetime: any = (new Date()).toISOString();
      body.set('completion_datetime', completionDatetime);
    }

    if(this.taskForm.get('addComment')?.value != '') {
      const lastComment: any = this.taskForm.get('addComment')?.value;
      body.set('last_comment', lastComment);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    this.http.post(environment.apiUrl+'/task/update/'+this.formData.task_number, body.toString(), {headers, withCredentials: true})
      .subscribe(response => {
        this.sharedService.handleFilterChange(response);
        let refreshCount = this.sharedService.getGlobalState('refreshCount') +1;
        this.sharedService.setGlobalState('refreshCount', refreshCount);

        this.router.navigate(['/home/task/'+response+'?saved='+refreshCount]);
        
        this._snackBar.openFromComponent(IconSnackBarComponent, {
          data: {
            message: `Task saved successfully!`,
            icon: 'check_circle'
          },
          duration: 3000
        })
      });
  }

  createSubTaskRoute() {
    this.router.navigate(
      ['home/subtask/create'],
      { queryParams: {
          workspace_id: this.formData.workspace_id,
          task_group_id: this.formData.task_group_id,
          task_number: this.formData.task_number
        } 
      }
    )
  }

  ngOnInit() {

    this.formData = {
      target_datetime: ''
    }

    this.route.params.subscribe((params) => {
      const taskId = params['taskId'];

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });

      const body = new URLSearchParams();
      const workspace_id=this.sharedService.getGlobalState('workspace')?.workspace_id;
      body.set('workspace_id', workspace_id)

      console.log('aaaaaaaa: ', workspace_id)

      if(workspace_id){
        this.http.post(environment.apiUrl+'/task/'+taskId, body.toString(), {headers, withCredentials: true})
          .subscribe((response: any) => {
            this.formData = response[0]; // Assign data to your formData
            this.initializeForm(); // Call a method to initialize your form
          });
      } else {
        this.http.get(environment.apiUrl+'/workspace/default', {headers, withCredentials: true})
          .subscribe((workspace: any) => {
            console.log(workspace)
            body.set('workspace_id', workspace)
            this.http.post(environment.apiUrl+'/task/'+taskId, body.toString(), {headers, withCredentials: true})
              .subscribe((response: any) => {
                this.formData = response[0]; // Assign data to your formData
                this.targetDatetime = this.formData.target_datetime
                this.initializeForm(); // Call a method to initialize your form
              });
          });
      }
    });

    this.sharedService.globalState$.subscribe((state) => {
        // Update the component's property when the state changes
        if(state.data){
          this.globalStateValue = state.data; // Replace with the appropriate key from your state
          this.taskStateValue = JSON.parse(JSON.stringify(this.globalStateValue));
        }

        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        });

        if(state.workspace?.workspace_id){
          for(let i=0; i<state.userInfo.length; i++){
            if(state.userInfo[i].workspace_id==state.workspace.workspace_id){
              this.groupList=state.userInfo[i];
              this.teamList=state.workspace.team_members;
              console.log(this.teamList)
            }
          }
          this.http.get(environment.apiUrl+'/task/workspace/'+state.workspace.workspace_id, {headers, withCredentials: true})
            .subscribe((response) => {
              this.taskList=response;
            })
        }
    });
  }

  toggleFormOptions(event: any) {
    if(event.target.value === 'Canceled') {
      this.taskForm.patchValue({cancelStatus: true});
      this.taskForm.get('cancelReason')?.enable();
      this.taskForm.patchValue({cancelReason: this.globalStateValue.cancel_reasons[0]});
    } else {
      this.taskForm.patchValue({cancelStatus: false});
      this.taskForm.patchValue({cancelReason: null});
      this.taskForm.get('cancelReason')?.disable();
    }

    if(event.target.value === 'On Hold') {
      this.taskForm.patchValue({holdStatus: true});
      this.taskForm.get('holdReason')?.enable();
      this.taskForm.patchValue({holdReason: this.globalStateValue.hold_reasons[0]});
    } else {
      this.taskForm.patchValue({holdStatus: false});
      this.taskForm.patchValue({holdReason: null});
      this.taskForm.get('holdReason')?.disable();
    }
  }

  onChangeValue(value: any, event?: any){
    if(this.taskForm.get('taskState')?.value != this.formData.task_state){
      this.toggleClass.taskState=true
    }else if(this.taskForm.get('taskState')?.value == this.formData.task_state){
      this.toggleClass.taskState=false
    }

    if(this.taskForm.get('holdReason')?.value != this.formData.hold_reason){
      this.toggleClass.holdReason=true
    }else if(this.taskForm.get('holdReason')?.value == this.formData.hold_reason){
      this.toggleClass.holdReason=false
    }

    if(this.taskForm.get('cancelReason')?.value != this.formData.cancel_reason){
      this.toggleClass.cancelReason=true
    }else if(this.taskForm.get('cancelReason')?.value == this.formData.cancel_reason){
      this.toggleClass.cancelReason=false
    }

    if(this.taskForm.get('taskImportance')?.value != this.formData.task_importance){
      this.toggleClass.taskImportance=true
    }else if(this.taskForm.get('taskImportance')?.value == this.formData.task_importance){
      this.toggleClass.taskImportance=false
    }

    if(String(this.taskForm.get('referenceTask')?.value)!=String(this.formData.reference_task)){
      this.toggleClass.referenceTask=true
    }else if(String(this.taskForm.get('referenceTask')?.value)==String(this.formData.reference_task)){
      this.toggleClass.referenceTask=false
    }

    if(value=='targetDatetime'){
      const targetDatetime = event;
      this.targetDatetime = targetDatetime;
      if(String(targetDatetime)!=String(this.formData.target_datetime)){
        this.toggleClass.targetDatetime=true
      }else{
        this.toggleClass.targetDatetime=false
      }
    }

    if(this.taskForm.get('groupName')?.value != this.formData.task_group_id){
      this.toggleClass.groupName=true
    }else if(this.taskForm.get('groupName')?.value == this.formData.task_group_id){
      this.toggleClass.groupName=false
    }

    if(this.taskForm.get('assignedTo')?.value != this.formData.assigned_to){
      console.log(this.formData)
      this.toggleClass.assignedTo=true
    }else if(this.taskForm.get('assignedTo')?.value == this.formData.assigned_to){
      this.toggleClass.assignedTo=false
    }

    if(this.taskForm.get('taskName')?.value != this.formData.task_name){
      this.toggleClass.taskName=true
    }else if(this.taskForm.get('taskName')?.value == this.formData.task_name){
      this.toggleClass.taskName=false
    }

    if(this.taskForm.get('taskDescription')?.value != this.formData.task_description){
      this.toggleClass.taskDescription=true
    }else if(this.taskForm.get('taskDescription')?.value == this.formData.task_description){
      this.toggleClass.taskDescription=false
    }

    if(this.taskForm.get('addComment')?.value != ''){
      this.toggleClass.addComment=true
    }else if(this.taskForm.get('addComment')?.value == ''){
      this.toggleClass.addComment=false
    }
    
  }
}
