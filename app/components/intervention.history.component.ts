import {Component, Input, Output, EventEmitter } from '@angular/core';
import {InterventionService} from '../services/intervention.service'
import {Filter} from '../services/filter'
import {AuthService} from '../services/auth'
import {Storage, LocalStorage} from 'ionic-angular';

@Component({
  selector: 'intervention-history',
  template: `
      <ion-card class="interventions">
      <ion-list-header>
        Historique des interventions
      </ion-list-header>
      <ion-list >
        <ion-item>
          <ion-label>Début</ion-label>
          <ion-datetime displayFormat="MMM DD YYYY" [(ngModel)]="event.dateStarts" ></ion-datetime>
        </ion-item>
        <ion-item>
          <ion-label>Fin</ion-label>
          <ion-datetime displayFormat="MMM DD YYYY" [(ngModel)]="event.dateEnds" ></ion-datetime>
        </ion-item>

      </ion-list>
      <button block (click)="getClosedInterventions()">Valider</button>
      </ion-card>
      <ion-card *ngFor="let intervention of interventions"  class="interventions">
        <ion-list-header >
          Intervention #{{intervention.id}}
        </ion-list-header>
        <ion-list>
          <ion-item>
            <ion-icon name="contact" item-left></ion-icon>
            {{intervention.customer_firstname}} {{intervention.customer_lastname}}
          </ion-item>
          <ion-item>
            <ion-icon name="calendar" item-left></ion-icon>
            {{intervention.intervention_date | date: 'dd/MM/yyyy'}}  {{intervention.intervention_date | date: 'HH'}}:{{intervention.intervention_date | date: 'mm'}}
          </ion-item>
          <ion-item>
            <ion-icon name="construct" item-left></ion-icon>
            {{intervention.intervention_type_short_description}}
          </ion-item>
          <ion-item>
            <ion-icon name="logo-euro" item-left></ion-icon>
            {{intervention.intervention_type_price}}
          </ion-item>
        </ion-list>

  </ion-card>
`,
styles: [  `.interventions{
  border-top-style: solid;
  border-top-color: #1a66ff;
  opacity:0.8;
},
       `
],
providers:[InterventionService]
})

export class InterventionsHistoryComponent{
  local: Storage = new Storage(LocalStorage);
  interventions: Object;
  errorMessage: any;
  public event = {
   dateStarts: '2016-01-01',
   dateEnds: '2016-01-01'
 }
  user_id: number;
  constructor(private interventionService: InterventionService, private auth: AuthService){
    // this.user_id = this.auth.user.user_metadata.depannologue_id
  }


 getInterventions(filter: Filter) {
  this.interventionService.getInterventions(filter)
      .subscribe(
       interventions => this.interventions = interventions,
       error =>  this.errorMessage = <any>error);
}

getClosedInterventions(){
    this.local.get('depannologue_id').then(depannologue_id=>{
  let filter = new Filter({type: "contractor&state&date", state:"closed", dateBegin: this.event.dateStarts, dateEnd:this.event.dateEnds,  profession:"", contractorId: depannologue_id});
  this.getInterventions(filter);
})
}


}
