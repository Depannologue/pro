import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AvailableCoponent} from '../../components/available.component'
import {GlobalCaCoponent} from '../../components/global.ca.component'
import {CurrentMonthCaComponent} from '../../components/current.month.ca.component'
import {AlertInterventionComponent} from '../../components/alert.intervention.component'
import {WeeklyAvailabilityComponent} from '../../components/weekly.availability.component'
import {AuthService} from '../../services/auth';
import {LocalNotifications} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html',
  directives:[AvailableCoponent, GlobalCaCoponent, CurrentMonthCaComponent, AlertInterventionComponent, WeeklyAvailabilityComponent],
})
export class HomePage {
  interventionNumber: number;
  ca="current";
  constructor(private navCtrl: NavController, private auth: AuthService) {

  }
  single() {
   LocalNotifications.schedule({
     id:1,
     title:'Single notification',
     text:'This is a single notification',
   });
  }
  setInterventionsNumber(interventionsNumber){
    this.interventionNumber = interventionsNumber;
  }
  ngOnInit(){

  }

}
