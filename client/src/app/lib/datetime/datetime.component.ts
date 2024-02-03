import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { dateToStr, strToDate } from 'src/app/lib/dateTransform';

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.css']
})
export class DatetimeComponent {
  @Input() strDatetime: any;
  @Input() disabled: boolean;
  @Output() valueOnChange = new EventEmitter<string>();

  taskForm: FormGroup;
  datetime: any;
  meridian: any = 'AM'

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.strDatetime = ''
    this.disabled=false

    this.taskForm = this.formBuilder.group({
      datetime_date: {value: '', disabled: this.disabled},
      datetime_hours: {value: '', disabled: this.disabled},
      datetime_minutes: {value: '', disabled: this.disabled},
    })
  }

  onChangeValue(){
    const datetime = dateToStr(this.taskForm.get('datetime_date')?.value,
                              this.taskForm.get('datetime_hours')?.value, 
                              this.taskForm.get('datetime_minutes')?.value,
                              this.meridian)
    this.valueOnChange.emit(datetime)
  }

  checkHours(){
    if(this.taskForm.get('datetime_hours')?.value>12 || this.taskForm.get('datetime_hours')?.value<0){
      this.taskForm.get('datetime_hours')?.setValue('');
    }
  }

  checkMinutes(){
    if(this.taskForm.get('datetime_minutes')?.value>59 || this.taskForm.get('datetime_minutes')?.value<0){
      this.taskForm.get('datetime_minutes')?.setValue('');
    }
  }

  changeMeridian() {
    if(this.meridian=='AM'){
      this.meridian='PM';
    }else{
      this.meridian='AM';
    }
  }

  ngOnInit() {
    if(this.strDatetime!='') {
      this.datetime=strToDate(this.strDatetime);
      this.meridian=this.datetime.meridian
    }

    this.taskForm = this.formBuilder.group({
      datetime_date: {value: new Date(this.datetime.date), disabled: this.disabled},
      datetime_hours: {value: this.datetime.hours, disabled: this.disabled},
      datetime_minutes: {value: this.datetime.minutes, disabled: this.disabled},
    });
  }
}
