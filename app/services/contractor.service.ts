import {Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import { Headers, RequestOptions } from '@angular/http';
import {Filter} from './filter'
import {Contractor} from './contractor'
import 'rxjs/Rx';

@Injectable()
export class ContractorService {

  constructor (private http:Http, private authHttp: AuthHttp) {}

  private contractorURL = 'https://api.depannologue.fr/api/v1/contractors';


  getContractors(filter: Filter): Observable<Array<Contractor>> {
     return this.authHttp.get(this.buildURL(filter))
                     .map(this.extractData)
                     .catch(this.handleError);
  }
  getContractorById(id: number): Observable<Contractor> {
     return this.authHttp.get(this.contractorURL + "/" + id)
                     .map(this.extractData)
                     .catch(this.handleError);
  }

  putContractor(user: any): Observable<Contractor> {
    let body = JSON.stringify({ user });
    console.log(body)
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.authHttp.put(this.contractorURL +"/"+ user.id, body, options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }
  putWeeklyAvailability(weekly_availability_attributes: any,  id: number): Observable<Contractor> {
    let body = JSON.stringify({ weekly_availability_attributes });
    body = "{\"user\":" + body + "}";
    console.log(body)
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.authHttp.put(this.contractorURL +"/"+ id, body, options)
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
    return this.contractorURL;
  }


}
