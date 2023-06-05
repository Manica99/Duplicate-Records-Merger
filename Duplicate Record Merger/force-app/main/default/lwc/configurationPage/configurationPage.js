import { LightningElement, track, wire, api } from 'lwc';
import getObject from '@salesforce/apex/ConfigurationSettings.getObject';
import getFields from '@salesforce/apex/ConfigurationSettings.getFields';

export default class ConfigurationPage extends LightningElement {


    @track objectValue;
    @track havingValue = false;
    @track objectList =[];
    @track fieldOptions =[];


    onHandleObjectSearch(event) {
        this.objectValue = event.target.value;
        console.log('this.object value-->', this.objectValue);
        getObject({ obj: this.objectValue })
            .then((result) => {
                console.log('result-->', result);
                if (result.length != 0) {
                    this.havingValue = true;
                    this.objectList = result;
                }
            })
            .catch((error) => {
                console.log('error-->', error);
                //this.objectList = undefined;
            });
    }

    onobjectselection(event) {
        console.log('event.target.dataset.name', event.target.dataset.name);
        this.objectValue = event.target.dataset.name;
        this.objectList = [];
        getFields({ obj: this.objectValue })
            .then((result) => {
                console.log('getFields-->', result);
                for(var i=0; i<result.length; i++){
                    this.fieldOptions.push({
                        label: result[i],
                        value: result[i]
                    });
                }
            })
            .catch((error) => {
                console.log('error-->', error);
                //this.objectList = undefined;
            });
        //this.message = '';
        //this.selectObjectValueChange();
    }

}