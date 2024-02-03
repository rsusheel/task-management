import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { dateToStr, strToDate } from 'src/app/lib/dateTransform';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-filter-options',
  templateUrl: './filter-options.component.html',
  styleUrls: ['./filter-options.component.css']
})
export class FilterOptionsComponent {
  globalStateValue:any;
  filterOptions: any;
  filterForm: any;
  targetDatetime: any;
  creationDatetime: any;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private sharedService: SharedService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<FilterOptionsComponent>,
  ) { 
      this.filterForm = this.formBuilder.group({
        creationDatetime_date: '',
        creationDatetime_hours: '',
        creationDatetime_minutes: '',
        creationDatetime_operator: '',
        groupIds: [],
        hasSubTask: [],
        importance: [],
        orderfield: '',
        orderSequence: '',
        targetDatetime_date: '',
        targetDatetime_hours: '',
        targetDatetime_minutes: '',
        targetDatetime_operator: '',
        taskStates: [],
      })
   }

  onCloseDialog() {
    this.dialogRef.close()
  }

  initializeForm() {

    this.sharedService.globalState$.subscribe((state) => {
      this.filterOptions = state.filterOptions;
      this.globalStateValue = state;
      const creationDatetime=strToDate(this.filterOptions.creation_datetime.datetime);
      const targetDatetime=strToDate(this.filterOptions.target_datetime.datetime);

      this.filterForm = this.formBuilder.group({
        creationDatetime_date: [new Date(creationDatetime.date)],
        creationDatetime_hours: [creationDatetime.hours],
        creationDatetime_minutes: [creationDatetime.minutes],
        creationDatetime_operator: [this.filterOptions.creation_datetime.operator],
        groupIds: [this.filterOptions.group_ids],
        hasSubTask: [this.filterOptions.has_sub_task],
        importance: [this.filterOptions.importance],
        orderfield: [this.filterOptions.order.field],
        orderSequence: [this.filterOptions.order.sequence],
        targetDatetime_date: [new Date(targetDatetime.date)],
        targetDatetime_hours: [targetDatetime.hours],
        targetDatetime_minutes: [targetDatetime.minutes],
        targetDatetime_operator: [this.filterOptions.target_datetime.operator],
        taskStates: [this.filterOptions.task_states],
      })
    })
  }

  inArray(value: any, array: any) {
    return this.filterOptions[array].includes(value);
  }

  onSaveFilter() {

  }

  onChangeCreationTime(event: any) {
    this.creationDatetime = event;
  }

  onChangeTargetTime(event: any) {
    this.targetDatetime = event;
  }

  ngOnInit() {
    this.initializeForm();
  }
  
}
