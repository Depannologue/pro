import {Component, Input, Output, EventEmitter } from '@angular/core';
import {InterventionService} from '../services/intervention.service'
import {Filter} from '../services/filter'
import {Camera} from 'ionic-native';
import {SocketIoService} from '../services/socket-io.service'
import {AuthService} from '../services/auth'
import {Storage, LocalStorage} from 'ionic-angular';

@Component({
  selector: 'intervention-current',
  template: `
      <ion-card  *ngFor="let intervention of interventions" class="interventions" >
        <ion-list>
        <ion-list-header>
          Intervention #{{intervention.id}}
        </ion-list-header>
          <ion-item>
            <ion-icon name="contact" item-left></ion-icon>
              {{intervention.customer_firstname}} {{intervention.customer_lastname}}
          </ion-item>
          <ion-item>
            <ion-icon name="calendar" item-left></ion-icon>
            <h4 *ngIf="!intervention.immediate_intervention">{{intervention.intervention_date | date: 'dd/MM/yyyy'}}  {{intervention.intervention_date | date: 'HH'}}:{{intervention.intervention_date | date: 'mm'}}</h4>
            <h4 *ngIf="intervention.immediate_intervention">Intervention immédiate</h4>
          </ion-item>
          <ion-item>
            <ion-icon name="map" item-left></ion-icon>
              <h4>{{intervention.address_address1}}</h4>
              <p>{{intervention.address_zipcode}} {{intervention.address_city}}</p>
            </ion-item>
             <ion-item>
                 <ion-input  [(ngModel)]="interventionPrice" type="number" placeholder="Prix intervention"></ion-input>
             </ion-item>
        </ion-list>
        <ion-row no-padding>
     <ion-col>
       <button (click)="call()"clear small positive>
         <ion-icon name='call'></ion-icon>
         {{intervention.customer_phone_number}}
       </button>
     </ion-col>
     <ion-col text-center>
       <button (click)="closeIntervention(intervention)" clear small positive>
         <ion-icon name='close-circle'></ion-icon>
         Clôturer
       </button>
     </ion-col>
   </ion-row>

    </ion-card>
`,
styles: [  `.interventions{
  border-top-style: solid;
  border-top-color: #1a66ff;
  opacity: 0.8;
}
       `
],
providers:[InterventionService, SocketIoService]
})

export class InterventionsCurrentComponent{
  local: Storage = new Storage(LocalStorage);
  interventions: Array<Object>;
  errorMessage: any;
  public base64Image: string;
  user_id:number;
  socket = io('http://139.59.128.211:5001');
  interventionPrice: number;
  constructor(private interventionService: InterventionService, private auth: AuthService){
    let id_token = this.auth.id_token
    let _socket = this.socket
    //this.user_id = this.auth.user.user_metadata.depannologue_id
    let _this = this
    this.socket.on('connect', function () {
      _socket.on('authenticated', function () {
        _socket.on('rt-change', function(msg){
          if(msg.resource == "interventions"){
              _this.getOpenedInterventions();;
          }
        });
    	})
    	.emit('authenticate', {token: id_token});
      });

  }


  takePicture(){
   Camera.getPicture({
       destinationType: Camera.DestinationType.DATA_URL,
       targetWidth: 1000,
       targetHeight: 1000
   }).then((imageData) => {
     // imageData is a base64 encoded string
       this.base64Image = "data:image/jpeg;base64," + imageData;
   }, (err) => {
       console.log(err);
   });
  }

  getInterventions(filter: Filter) {
    this.interventionService.getInterventions(filter)
        .subscribe(
         interventions => this.interventions = interventions,
         error =>  this.errorMessage = <any>error);

  }

  getOpenedInterventions(){
      this.local.get('depannologue_id').then(depannologue_id=>{
    let filter = new Filter({type: "contractor&state", state:"opened", dateBegin:"", dateEnd:"",  profession:"", contractorId: depannologue_id});
    this.getInterventions(filter);
  })
  }

  closeIntervention(intervention){
    if(!this.interventionPrice){
      this.interventionPrice = intervention.intervention_type_price;
    }
    this.interventionService.putIntervention({id: intervention.id, state: "closed", price: this.interventionPrice})
                            .subscribe(
                             intervention => console.log(intervention),
                             error =>  this.errorMessage = <any>error);
    this.interventionPrice = null;
  }

  ngOnInit(){
    this.getOpenedInterventions()
  }
}
