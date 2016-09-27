import {Component } from '@angular/core';
import {InterventionService} from '../services/intervention.service'
import {Filter} from '../services/filter'
import {AuthService} from '../services/auth'
import {Storage, LocalStorage} from 'ionic-angular';

@Component({
  selector: 'global-ca',
  template: `
      <ion-item >
      <ion-avatar item-left>
      <img src="img/ca.png">
      </ion-avatar>
      <h2>{{totalCA}} euros</h2>
      <p>Commission: {{totalComm}} euros</p>
      </ion-item>
`,
styles: [  `
       `
],
providers:[InterventionService]
})

export class GlobalCaCoponent{
  totalCA: number;
  totalComm: number;
  errorMessage: any;
  user_id:number;
  local: Storage = new Storage(LocalStorage);

  constructor(private interventionService: InterventionService, private auth: AuthService){
    // this.user_id = this.auth.user.user_metadata.depannologue_id
  }
  getInterventions(filter: Filter) {

    this.interventionService.getInterventions(filter)
        .subscribe(
         interventions => this.totalCA = this.totalInterventionsPrice(interventions),
         error =>  this.errorMessage = <any>error);

  }

  ngOnInit(){
    this.local.get('depannologue_id').then(depannologue_id=>{

    let filter = new Filter({type:"contractor", dateBegin:"", dateEnd:"", state:"",profession:"",contractorId:depannologue_id})
    this.getInterventions(filter);
  })
  }

  totalInterventionsPrice(interventions){
      let total = 0;
      let price = 0;
        interventions.forEach(function(element){
          if(!element.price){
            price = 0;
            console.log(element.price)
          }else{
            price =  parseInt(element.price);
          }
          total += price;
          console.log(total)
        })
        console.log(total)
      this.totalComm = total * 0.8
      return total;
    }



}
