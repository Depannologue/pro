import {Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import { Headers, RequestOptions } from '@angular/http';
import { Intervention } from './intervention'
import {Filter} from './filter'
import 'rxjs/Rx';

@Injectable()
export class InterventionService {

  constructor (private http:Http, private authHttp: AuthHttp) {}

  private interventionURL = 'https://api.depannologue.fr/api/v1/interventions';


  getInterventions(filter: Filter): Observable<Array<Object>> {
     return this.http.get(this.buildURL(filter))
                     .map(this.extractData)
                     .catch(this.handleError);
  }

  putIntervention(intervention: any): Observable<Intervention> {
    let body = JSON.stringify({ intervention });
    console.log(body)
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.authHttp.put(this.interventionURL +"/"+ intervention.id, body, options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    console.log(body)
    return body || { };
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error._body ? `${error._body}` : 'Server error';
      return Observable.throw(errMsg);
  }

  private buildURL(filter:Filter){
    let state: string = "";
    if (filter.state == "closed"){
           state =  "&is_in_state=" + filter.state;
    }else{
           state =  "&is_not_in_state=closed";
    }
    switch(filter.type){
      case "contractor":
        return this.interventionURL + "?contractor_id=" + filter.contractorId;
      case "state":
        return this.interventionURL + "?is_in_state=" + filter.state;
      case "contractor&state":
        return this.interventionURL + "?contractor_id=" + filter.contractorId + state;
      case "contractor&state&date":
        return this.interventionURL + "?start_date=" + filter.dateBegin + "&end_date=" + filter.dateEnd + "&contractor_id=" + filter.contractorId + state;
      case "current_month&&contractor":
        return this.interventionURL + "?contractor_id=" + filter.contractorId + "&current_month=1";
      case "state&contractor_decline":
        return this.interventionURL + "?is_in_state=" + filter.state + "&contractor_decline=" + filter.contractor_decline;
      default:
        return this.interventionURL;
    }
  }


}
