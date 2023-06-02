import { LightningElement, track, wire, api } from 'lwc';
import getAccounts from '@salesforce/apex/AccountRelatedContactApex.getAccounts';
import updateRecords from '@salesforce/apex/AccountRelatedContactApex.updateRecords';
import TRIBIKE_IMAGE from '@salesforce/resourceUrl/TriBike_Image';
import INSTAGRAM_LOGO from '@salesforce/resourceUrl/InstagramTriBike';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';

const Cols = [
    {label: 'Account Name', fieldName : 'Name', editable: true},
    {label: 'Industry', fieldName : 'Industry', editable: true},
    {label: 'Phone', fieldName : 'Phone', editable: true},
    {type: "button", typeAttributes: {
        label: 'Contact',
        name: 'Contact',
        title: 'Contact',
        disabled: false,
        value: 'contacts',
        iconPosition: 'left'
    } }
];

export default class AccountRelatedContactsUsingInlineEditing extends LightningElement {

    @api records;
    @track contacts = [];
    @track columns = Cols;
    @track check = false;
    @track accName;
    fldsItemValues = [];

    tribikeImg = TRIBIKE_IMAGE;
    instagramLogo = INSTAGRAM_LOGO;

    @wire (getAccounts) wiredAccounts({data, error}){
        if (data) {
            this.records = data;
            console.log(data);
        }
        else if(error){
            console.log(error);
        }
    }

    handleContacts (event){
        this.contacts = [];
        this.check = true;
        let data = this.records;
        data.forEach(record => {
            this.contacts = record.Contacts;
            this.accName = record.Name;
        });
    }

    async handleSave (event){
         console.log('save');
        // this.fldsItemValues = JSON.stringify(event.detail.draftValues);
        // console.log('fldsItemValues',this.fldsItemValues);
        // updateRecords({accList: this.fldsItemValues})
        // .then(result => console.log(result))
        // .catch(error => console.log(error))
        // .finally(()=> this.processing = false);

        // const records = event.detail.draftValues.slice().map((draftValue) => {
        //     const fields = Object.assign({}, draftValue);
        //     return { fields };
        // });
        // console.log('records', records);
        // this.fldsItemValues = [];

        const updatedFields = event.detail.draftValues;
        const notifyChangeIds = updatedFields.map(row => { return { "recordId": row.Id } });
        console.log('updateFields',updatedFields);
        updateRecords({accList: updatedFields})
         .then(result => console.log(result))
         .catch(error => console.log(error))
         .finally(()=> this.processing = false);
    }
 

    closeModal(event){
        this.check = false;
       }
}