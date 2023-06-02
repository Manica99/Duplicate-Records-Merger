import { LightningElement,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getDupLeadRecAsPerSelectedName from '@salesforce/apex/BulkifyLeadObject1.getDupLeadRecAsPerSelectedName';
import handleMerge1 from '@salesforce/apex/BulkifyLeadObject1.handleMerge';
const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Company', fieldName: 'Company' },
    { label: 'Phone', fieldName: 'Phone'},
    { label: 'Title', fieldName: 'Title'},
    { label: 'Email', fieldName: 'Email'},
];

export default class ChildDuplicateRecord extends LightningElement {
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

        selectedRc.map((data)=>{
            if(!this.selectedRowsId.includes(data.Id)){
                this.selectedRowsId.push(data.Id);
            }
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
        handleMerge1({records:this.selectedRowsId})
        .then((data)=>{
            console.log('Successfully Merge==',data);
             if(data!=''){
                    const event = new ShowToastEvent({
                    title: 'Toast message',
                    message: 'Duplicated has been merged.',
                    variant: 'success',
                    mode: 'dismissable'
                });
                this.dispatchEvent(event);
                 const closeChild = new CustomEvent("closeevent",{
            detail:false
        })
        this.dispatchEvent(closeChild);
            }
        })
       
    }

    handleclick(){
        const pageevent=new CustomEvent("getbool");
        this.dispatchEvent(pageevent);
    }
}