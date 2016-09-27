export class Filter{
  type: string;
  dateBegin: string;
  dateEnd: string;
  state: string;
  profession: string;
  contractorId: number;
  contractor_decline: number;
  constructor(data){
    this.type = data.type;
    this.dateBegin = data.dateBegin;
    this.dateEnd = data.dateEnd;
    this.state = data.state;
    this. profession = data.profession;
    this. contractorId = data.contractorId;
    this.contractor_decline = data.contractor_decline
  }
}
