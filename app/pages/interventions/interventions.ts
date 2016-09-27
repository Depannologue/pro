import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {InterventionsCurrentComponent} from '../../components/intervention.current.component'
import {InterventionsHistoryComponent} from '../../components/intervention.history.component'
import {AuthService} from '../../services/auth';

@Component({
  templateUrl: 'build/pages/interventions/interventions.html',
  directives: [InterventionsCurrentComponent, InterventionsHistoryComponent]
})
export class InterventionsPage {
  interv ="current"
  constructor(private navCtrl: NavController, private auth: AuthService) {
  }
}
