import {Component } from '@angular/core';
import {Filter} from '../services/filter'
import {ContractorService} from '../services/contractor.service'
import {WeeklyAvailability} from './weeklyAvailability'
import {SocketIoService} from '../services/socket-io.service'
import {AuthService} from '../services/auth'
import {Storage, LocalStorage} from 'ionic-angular';

@Component({
  selector: 'weekly-availability',
  template: `
      <ion-card class="wa">
        <ion-list>
          <ion-list-header>
            Disponibilité hebdomadaire
          </ion-list-header>
          <ion-item>
            <ion-label>Jours</ion-label>
            <ion-select (ionChange)='onChange()' [(ngModel)]="selectedDay">
              <ion-option  *ngFor="let day of days" value="{{day.value}}" >{{day.label}}</ion-option>
            </ion-select>
          </ion-item>
          <ion-item  >
            <ion-label>Plages horaires</ion-label>
            <ion-select [(ngModel)]="selectedTimeSlots" multiple="true">
              <ion-option *ngFor="let timeSlot of timeSlots" value="{{timeSlot.value}}" checked="true">{{timeSlot.label}}</ion-option>
            </ion-select>
          </ion-item>
            <button positive block clear  (click)="changeAvailability()">Valider</button>
       </ion-list>
       </ion-card>
`,
styles: [  `.wa{
  border-top-style: solid;
  border-top-color: #1a66ff;
  opacity: 0.8;
}
       `
],
providers:[ContractorService, SocketIoService]
})

export class WeeklyAvailabilityComponent{
  local: Storage = new Storage(LocalStorage);
  contractor:Object;
  weeklyAvailability: Object;
  errorMessage: any;
  socket = io('http://139.59.128.211:5001');
  selectedDay:string;
  selectedTimeSlots:  Array<string> = [];
  days = [
          {value: "monday",label:"Lundi"},
          {value: "tuesday",label:"Mardi"},
          {value: "wednesday",label:"Mercredi"},
          {value: "thursday",label:"Jeudi"},
          {value: "friday",label:"Vendredi"},
          {value: "saturday",label:"Samedi"},
          {value: "sunday",label:"Dimanche"}
        ];
   timeSlots =[{value : "0_4",label: "00h à 04h "},
               {value:"4_8",label:  "04h à 08h "},
               {value:"8_12",label:"08h à 12h"},
               {value:"12_16",label:"12h à 16h"},
               {value:"16_20",label:"16h à 20h"},
               {value:"20_24", label:"20h à 00h"}]
   user_id: number;
  constructor(private contractorService: ContractorService, private auth: AuthService){

    // this.user_id = this.auth.user.user_metadata.depannologue_id
    let id_token = this.auth.id_token
    let _socket = this.socket
    let _this = this
    this.socket.on('connect', function () {
      _socket.on('authenticated', function () {
        _socket.on('rt-change', function(msg){
          if(msg.resource == "users"){
            _this.local.get('depannologue_id').then(depannologue_id=>{
              _this.getContractorById(depannologue_id);
              console.log("ok")
            })
          }
        });
      })
      .emit('authenticate', {token: id_token});
      });


  }

  getContractorById(id: number) {
    this.contractorService.getContractorById(id)
        .subscribe(
         contractor => this.weeklyAvailability = contractor.weekly_availability,
         error =>  this.errorMessage = <any>error);
  }

  putWeeklyAvailability(weeklyAvailability){
    this.local.get('depannologue_id').then(depannologue_id=>{
      console.log(weeklyAvailability)
    this.contractorService.putWeeklyAvailability(weeklyAvailability, depannologue_id).subscribe(
      contractor => this.contractor = contractor,
      error =>  this.errorMessage = <any>error);
    })
  }

  constructWeeklyAvailabiliy(timeSlots, day){
    let _weeklyAvailability : Object = this.weeklyAvailability ;
    let prop : string ;
    this.timeSlots.forEach(function(element){
      prop  = day + "_" + element.value + "_availability"
      _weeklyAvailability[prop] = false;
    })
       timeSlots.forEach(function(element){
         prop  = day + "_" + element + "_availability"
         _weeklyAvailability[prop] = true;
       })
       this.weeklyAvailability = _weeklyAvailability
    return _weeklyAvailability;

  }
  ngOnInit(){
    this.local.get('depannologue_id').then(depannologue_id=>{

      this.getContractorById(depannologue_id);
    })
  }

  availableTimeSpots(selectedDay, weeklyAvailability){
    let prop = "";
    let selectedTimeSlots = [];
    var obj = this;
    this.timeSlots.forEach(function(element){
      prop = selectedDay + "_" + element.value + "_availability"
      if (weeklyAvailability[prop] == true){
        selectedTimeSlots.push(element.value);
      }
    })
    this.selectedTimeSlots = selectedTimeSlots;
  }

changeAvailability(){
  console.log(this.selectedTimeSlots)
  this.putWeeklyAvailability(this.constructWeeklyAvailabiliy(this.selectedTimeSlots, this.selectedDay))
}

onChange(){
  console.log(this.selectedDay)
  console.log(this.weeklyAvailability)
  this.availableTimeSpots(this.selectedDay, this.weeklyAvailability)
}



}
