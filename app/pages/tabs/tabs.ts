import {Component} from '@angular/core';
import {HomePage} from '../home/home';
import {InterventionsPage} from '../interventions/interventions';
import {AuthService} from '../../services/auth';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;

  constructor(private auth: AuthService) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = InterventionsPage;
  }
}
