export class Intervention {
   address1:string;
   address2:string;
   phone_number:string;
   city:string;
   email:string;
   zipcode:string;
   firstname:string;
   lastname:string;
   intervention_child_slug:string;
   profession_id:string;
   intervention_date_3i:string;
   intervention_date_2i:string;
   intervention_date_1i:string;
   intervention_date_4i:string;
   intervention_date_5i:string;
   immediate_intervention:boolean;
   constructor (address1, phone_number, city, email, zipcode, firstname , lastname, intervention_date_3i, intervention_date_2i, intervention_date_1i, intervention_date_4i, intervention_date_5i,intervention_child_slug,profession_id, isImmediate) {
      this.address1 = address1;
      this.phone_number = phone_number;
      this.city = city;
      this.email = email;
      this.zipcode = zipcode;
      this.firstname = firstname;
      this.lastname = lastname;
      this.intervention_date_3i= intervention_date_3i;
      this.intervention_date_2i= intervention_date_2i;
      this.intervention_date_1i= intervention_date_1i;
      this.intervention_date_4i= intervention_date_4i;
      this.intervention_date_5i= intervention_date_5i;
      this.intervention_child_slug = intervention_child_slug;
      this.profession_id = profession_id;
      this.immediate_intervention = isImmediate;
   }
}
