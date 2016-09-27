import {Component, Output, EventEmitter } from '@angular/core';
import {InterventionService} from '../services/intervention.service'
import {Filter} from '../services/filter'
import {SocketIoService} from '../services/socket-io.service'
import {AuthService} from '../services/auth'
import {Storage, LocalStorage} from 'ionic-angular';
import {LocalNotifications} from 'ionic-native';

@Component({
  selector: 'alert-intervention',
  template: `
<ion-card class="alert">
  <ion-list>
<ion-list-header>
          <ion-avatar item-left>
            <img src="img/alert.png">
          </ion-avatar>
          {{interventions.length}} nouvelles interventions
</ion-list-header>

    <ion-slides pager>
      <ion-slide *ngFor="let intervention of interventions">

        <ion-item>
          <ion-icon name="build" item-left large></ion-icon>
          <h2>{{intervention.intervention_type_short_description}}</h2>
          <p>{{intervention.address_address1}} {{intervention.address_zipcode}} {{intervention.address_city}}</p>
        </ion-item>
        <ion-item>
          <ion-icon name="logo-euro" item-left large></ion-icon>
          <h2>{{intervention.intervention_type_price}}</h2>
          <p>{{intervention.intervention_type_price * 0.8}}</p>
        </ion-item>
        <ion-item>
          <ion-icon name="calendar" item-left></ion-icon>
          <h4 *ngIf="!intervention.immediate_intervention">{{intervention.intervention_date | date: 'dd/MM/yyyy'}}  {{intervention.intervention_date | date: 'HH'}}:{{intervention.intervention_date | date: 'mm'}}</h4>
          <h4 *ngIf="intervention.immediate_intervention">Intervention immédiate</h4>
        </ion-item>
        <ion-row no-padding>
  <ion-col>
    <button (click)="acceptIntervention(intervention)" clear small positive>
      <ion-icon name='checkmark-circle-outline'></ion-icon>
      Accepter
    </button>
  </ion-col>
  <ion-col text-center>
    <button (click)="declineIntervention(intervention)" clear small positive>
      <ion-icon name='close'></ion-icon>
      Décliner
    </button>
  </ion-col>
</ion-row>

     </ion-slide>
    </ion-slides>
    </ion-list>
    </ion-card>
`,
styles: [  `.alert{
  border-top-style: solid;
  border-top-color: #1a66ff;
  opacity: 0.8;
}
       `
],
providers:[InterventionService, SocketIoService]
})

export class AlertInterventionComponent{
  local: Storage = new Storage(LocalStorage);
  interventions: Array<Object> = [];
  errorMessage: any;
  user_id : number ;
  id_token: string;
  socket = io("http://139.59.128.211:5001")
  constructor(private interventionService: InterventionService, private auth: AuthService){
    let id_token = this.auth.id_token
    let _socket = this.socket
    //this.user_id = this.auth.user.user_metadata.depannologue_id
    let _this = this
    this.socket.on('connect', function () {
      _socket.on('authenticated', function () {
        _socket.on('rt-change', function(msg){
          if(msg.resource == "interventions"){
              _this.getPendingValidationInterventions();
          }
        });
    	})
    	.emit('authenticate', {token: id_token});
      });
  }

  single() {
   LocalNotifications.schedule({
     id:1,
     title:'Single notification',
     text:'This is a single notification',
   });
  }

  getInterventions(filter: Filter) {
    this.interventionService.getInterventions(filter)
        .subscribe(
         interventions => this.interventions = interventions,
         error =>  this.errorMessage = <any>error);
  }

  ngOnInit(){
      this.getPendingValidationInterventions();
      this.single(); 
  }

  getPendingValidationInterventions(){
    this.local.get('depannologue_id').then(depannologue_id=>{
    let filter = new Filter({type: "state&contractor_decline", state:"pending_pro_validation", dateBegin:"", dateEnd:"",  profession:"", contractorId: this.user_id, contractor_decline:depannologue_id});
    this.getInterventions(filter);})

  }

  acceptIntervention(intervention){
      this.local.get('depannologue_id').then(depannologue_id=>{
    this.interventionService.putIntervention({id: intervention.id, state: "pro_on_the_road", contractor_id: depannologue_id })
                            .subscribe(
                             intervention => console.log(intervention),
                             error =>  this.errorMessage = <any>error);
                           })
  }

  declineIntervention(intervention){
      this.local.get('depannologue_id').then(depannologue_id=>{
      this.interventionService.putIntervention({id: intervention.id, contractors_decline: depannologue_id })
                              .subscribe(
                               intervention => console.log(intervention),
                               error =>  this.errorMessage = <any>error);
                             })
  }


}
