import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { SharedService } from 'src/app/shared.service';
import { environment } from 'src/environment/environment.dev';
import { FilterOptionsComponent } from '../../task-bar/filter-options/filter-options.component';

@Component({
  selector: 'app-task-summary',
  templateUrl: './task-summary.component.html',
  styleUrls: ['./task-summary.component.scss']
})
export class TaskSummaryComponent {
  private filterOptionSubscription: Subscription = new Subscription();
  taskList: any;

  constructor(
    private http:HttpClient,
    private sharedService:SharedService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  selectedState: any;
  setState(state: any) {
    this.selectedState = state;
    console.log(state)
  }

  stateValues(state: any) {
    let taskStates: any;

    switch(state) {
      case 'Created':
        taskStates = ['Created','In Progress', 'On Hold', 'Canceled'];
        break;
      
      case 'In Progress':
        taskStates = ['In Progress', 'On Hold', 'Completed', 'Canceled'];
        break;
      
      case 'On Hold':
        taskStates = ['In Progress', 'On Hold', 'Completed', 'Canceled'];
        break;
      
      case 'Completed':
        taskStates = ['Completed', 'Re-opened', 'Closed'];
        break;
  
      case 'Re-opened':
        taskStates = ['Re-opened', 'In Progress', 'On Hold', 'Canceled'];
        break;
  
      case 'Canceled':
        taskStates = ['Canceled', 'Re-opened'];
        break;
  
      case 'Closed':
        taskStates = ['Closed', 'Re-opened'];
        break;
    }

    return taskStates;
  }

  onTaskSelect(workspace_id: any, task_number: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams();

    body.set('workspace_id', workspace_id)
    // body.set('task_number', task_number)

    this.http.post(environment.apiUrl+'/task/'+task_number, body.toString(),{headers, withCredentials: true})
      .subscribe(response => {
        this.router.navigate(['/home/task/'+task_number]);
      });
  }

  openFilterDialog() {
    const dialogRef = this.dialog.open(FilterOptionsComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnInit() {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa')
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const filterOptions = this.sharedService.getGlobalState('filterOptions')
    this.sharedService.globalState$.subscribe(state => {
      console.log(state)
    })
    if(filterOptions){
      const body = new URLSearchParams();
    
      body.set('workspace_id', this.sharedService.getGlobalState('filterOptions').workspace_id);
      body.set('group_ids', this.sharedService.getGlobalState('filterOptions').group_ids);
      body.set('task_states', this.sharedService.getGlobalState('filterOptions').task_states);
      body.set('task_importance', this.sharedService.getGlobalState('filterOptions').importance);
      body.set('has_sub_task', this.sharedService.getGlobalState('filterOptions').has_sub_task);
      body.set('creation_datetime', this.sharedService.getGlobalState('filterOptions').creation_datetime.datetime);
      body.set('creation_datetime_operator', this.sharedService.getGlobalState('filterOptions').creation_datetime.operator);
      body.set('target_datetime', this.sharedService.getGlobalState('filterOptions').target_datetime.datetime);
      body.set('target_datetime_operator', this.sharedService.getGlobalState('filterOptions').target_datetime.operator);
      body.set('order_field', this.sharedService.getGlobalState('filterOptions').order.field);
      body.set('order_sequence', this.sharedService.getGlobalState('filterOptions').order.sequence);

      this.http.post(environment.apiUrl+'/task/filter', body.toString(), {headers, withCredentials: true})
        .subscribe((response) => {
          this.taskList=response;
          console.log(response)
        })
      }
    this.filterOptionSubscription = this.sharedService.getFilterChangeObservable()
      .subscribe((group) => {
        const filterOptions = this.sharedService.getGlobalState('filterOptions')
        if(filterOptions){
          const body = new URLSearchParams();
        
          body.set('workspace_id', this.sharedService.getGlobalState('filterOptions').workspace_id);
          body.set('group_ids', this.sharedService.getGlobalState('filterOptions').group_ids);
          body.set('task_states', this.sharedService.getGlobalState('filterOptions').task_states);
          body.set('task_importance', this.sharedService.getGlobalState('filterOptions').importance);
          body.set('has_sub_task', this.sharedService.getGlobalState('filterOptions').has_sub_task);
          body.set('creation_datetime', this.sharedService.getGlobalState('filterOptions').creation_datetime.datetime);
          body.set('creation_datetime_operator', this.sharedService.getGlobalState('filterOptions').creation_datetime.operator);
          body.set('target_datetime', this.sharedService.getGlobalState('filterOptions').target_datetime.datetime);
          body.set('target_datetime_operator', this.sharedService.getGlobalState('filterOptions').target_datetime.operator);
          body.set('order_field', this.sharedService.getGlobalState('filterOptions').order.field);
          body.set('order_sequence', this.sharedService.getGlobalState('filterOptions').order.sequence);

          this.http.post(environment.apiUrl+'/task/filter', body.toString(), {headers, withCredentials: true})
            .subscribe((response) => {
              this.taskList=response;
              console.log(response)
            })
        }
    })
  }
}
