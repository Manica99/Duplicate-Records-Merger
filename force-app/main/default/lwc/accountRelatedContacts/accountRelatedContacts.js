import { LightningElement, track, wire, api } from 'lwc';
import getAccounts from '@salesforce/apex/AccountRelatedContactApex.getAccounts';

console.log('Checj');
export default class AccountRelatedContacts extends LightningElement {

    @api records;
    @track contacts = [];

    @track check = false;
   
    
    // @track columns = [
    //     {label:'Name', fieldName:'Name'},
    //     {label:'Id', fieldName:'Id'},
    //     {type: "button", typeAttributes: {
    //         label: 'Contacts',
    //         name: 'Contacts',
    //         title: 'Contacts',
    //         disables: 'false',
    //         value: 'contacts',
    //         iconPosition: 'left'
    //     } 
    // }
        
        
    // ];
    @track accountList;
    @track accName;
    
    @wire (getAccounts) wiredAccounts({data,error}){
        if (data) {
            
             this.records = data;
             console.log('this.records', this.records);
           
        } else if (error) {
        console.log(error);
        }
   }

   handleContact (event){
    this.contacts=[];
    this.check = true;
    console.log('Check2',event.target.dataset.id);
    let data = this.records;
    data.forEach(record => {
        if(record.Id == event.target.dataset.id){
            this.contacts = record.Contacts;
            this.accName = record.Name;
            console.log('contacts',contact);
        }
    });
    
   }

   closeModal(event){
    this.check = false;
   }
    
}