import { LightningElement,api } from 'lwc';
import getDupLeadRecAsPerSelectedName from '@salesforce/apex/BulkifyLeadObject.getDupLeadRecAsPerSelectedName';
import handleMerge from '@salesforce/apex/BulkifyLeadObject.handleMerge';
const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Company', fieldName: 'Company' },
    { label: 'Phone', fieldName: 'Phone'},
    { label: 'Title', fieldName: 'Title'},
    { label: 'Email', fieldName: 'Email'},
];

export default class ChildDuplicateRecords extends LightningElement {
data;
columns = columns;
disableButton=true;
selectedRowsId=[];
@api selectedname;

    connectedCallback() {
        console.log('Child Call==>',this.selectedname);
        getDupLeadRecAsPerSelectedName({selectedName:this.selectedname})
        .then((data)=>{
            console.log('Child Data===>',data);
            this.data=data;
        })
    }

     handleRowSelection(event){
         var selectedRc = event.detail.selectedRows;

        selectedRc.map(data=>{
            this.selectedRowsId.push(data.Id);
        });
        console.log('selectedRows');
        console.log(selectedRc);
        if(selectedRc.length>1){
            this.disableButton=false;
        }
        else{
            this.disableButton=true;
        }
    }
    handleMerge(){
        console.log('this.selectedRowsId===>',this.selectedRowsId);
        handleMerge({records:this.selectedRowsId})
        // .then((data)=>{

        // })
    }

    handleclick(){
        const pageevent=new CustomEvent("getbool");
        this.dispatchEvent(pageevent);
    }
}