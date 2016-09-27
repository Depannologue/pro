import {Component, OnInit } from '@angular/core';
import {ContractorService} from '../services/contractor.service';
import {Contractor} from '../services/contractor';
import {AuthService} from '../services/auth'
import {Storage, LocalStorage} from 'ionic-angular';

@Component({
  selector: 'available',
  template: `
    <ion-card class="available" >
    <ion-list>
    <ion-list-header>
      Disponibilité 
    </ion-list-header>
      <ion-item>
      <ion-avatar item-left>
        <img src="img/profile.png">
      </ion-avatar>
      <h2 class="font">{{contractor.lastname}}  {{contractor.firstname}}</h2>
      <p>Etes vous disponilbe ?</p>
      </ion-item>
      <ion-item>
      <ion-toggle (ionChange)="onChange()" [(ngModel)]="available"></ion-toggle>
      </ion-item>

    </ion-list>


    </ion-card>
`,
styles: [  `.available{
    border-top-style: solid;
    border-top-color: #1a66ff;
    opacity: 0.8;
}

       `
],
providers:[ContractorService]
})

export class AvailableCoponent{
  contractor: Contractor = new Contractor;
  available: boolean ;
  errorMessage: any;
  user_id:number;
  local: Storage = new Storage(LocalStorage);

  constructor(private contractorService: ContractorService,private auth: AuthService){
    //depannologue_id = this.auth.user.user_metadata.depannologue_id;
  }

  getContractorById(id: number) {
    this.contractorService.getContractorById(id)
        .subscribe(
         contractor =>{ this.contractor = contractor
                        this.available  = contractor.exceptional_availabilities_available_now},
         error =>  this.errorMessage = <any>error);
  }

  changeAvailability(available){
    this.local.get('depannologue_id').then(depannologue_id=>{

    let exceptional_availabilities_attributes = {
      "0":{available_now: available}
    }
    this.contractorService.putContractor({id: depannologue_id , exceptional_availabilities_attributes})
                            .subscribe(
                             contractor => console.log(contractor),
                             error =>  this.errorMessage = <any>error);
                           })
  }
  ngOnInit(){
    this.local.get('depannologue_id').then(depannologue_id=>{

    this.getContractorById(depannologue_id );
  })
  }

  onChange(){
    console.log(this.available)
    this.changeAvailability(this.available)
  }


}
