import { LightningElement, api, track } from 'lwc';
// import getPickListValue from '@salesforce/apex/productListController.getPickListValues';
// import getPriceBook from '@salesforce/apex/productListController.getpriceBook';
// import getProductFromPriceBookId from '@salesforce/apex/productListController.getpriceBookProducts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ListViewFilter extends LightningElement {

        @api parentData; // all data 
        @api filterValue;
        // @track priceBook; //no
        // @track pricebookVal; //no
        // @track priceBookLabelVal; //no

    get allOperators() {
        return [
            { label: 'equals', value: '=' },
            { label: 'not equal to', value: '!=' },
            { label: 'less than', value: '<' },
            { label: 'greater than', value: '>' },
            { label: 'less or equal', value: '<=' },
            { label: 'greater or equal', value: '>=' },
            { label: 'contains', value: 'like' },
            { label: 'does not contain', value: 'not like' },
            { label: 'starts with', value: 'starts with' }
        ];
    }

    get textOperators() {
        return [
            { label: 'equals', value: '=' },
            { label: 'not equal to', value: '!=' },
            { label: 'contains', value: 'like' },
            { label: 'does not contain', value: 'not like' },
            { label: 'starts with', value: 'starts with' }
        ];
    }

    get picklistOperators() {
        return [
            { label: 'equals', value: '=' },
            { label: 'not equal to', value: '!=' }
        ];
    }

    get doubleOperators() {
        return [
            { label: 'equals', value: '=' },
            { label: 'not equal to', value: '!=' },
            { label: 'less than', value: '<' },
            { label: 'greater than', value: '>' },
            { label: 'less or equal', value: '<=' },
            { label: 'greater or equal', value: '>=' }
        ];
    }

    showFilterLogic = false;
    showFilterLogicPart = false;
    showHelpText = false;

    @track filterFieldList = []
    @track records = [];

    @track fieldList = [];

    @track listViewMethod;

    @track fieldMap;
    // @track searchVal='';
    // @track fieldName = 'Name';
    // @track priceBookProductList =[];
    @track showSpinner = false;

    connectedCallback() {
        this.getFieldList();
    }
    // @track dataList=[];
    // @api sObjectName;
    // @api fieldSetName;
    getFieldList() {
                this.filterFieldList = JSON.parse(JSON.stringify(this.filterValue));
                var data = JSON.parse(JSON.stringify(this.parentData));
                    const fields = [];
                    this.fieldMap = data.fieldMap; 
                    this.records = JSON.parse(JSON.stringify(data.recordList));
                    console.log('this.records', this.records);
                    // this.dataList = JSON.parse(JSON.stringify(this.searchList));
                    for(var key in data.fieldMap){
                        if(key != 'Id'){
                            fields.push({
                                label: key,
                                value: key,
                                type: data.fieldMap[key].split(',')[1],
                            });
                        }
                    }
                    fields.forEach(element => {
                        let field = {
                            label: element.label,
                            value: element.value,
                            isText: (element.type == 'DATE' || element.type == 'DATETIME' || element.type == 'PICKLIST' || element.type == 'DOUBLE' || element.type == 'CURRENCY') ?  false : true,
                            isDate: element.type == 'DATE' ? true : false,
                            isDateTime: element.type == 'DATETIME' ? true : false,
                            isPicklist: element.type == 'PICKLIST' ? true : false,
                            isDouble: element.type == 'DOUBLE' || element.type == 'CURRENCY' ? true : false,
                            picklistValues: [],
                            needOperator: true
                        }
                        if (field.isDate || field.isDateTime) {
                            field.needOperator = false;
                        }
                        this.fieldList.push(field);
                    })
                    // this.getPickListValueList();
                    // this.showSpinner = true;
                    // getPriceBook()
                    //     .then((data) => {
                    //         var priceBookOption =[];
                    //             priceBookOption.push({
                    //                         label: 'All Price Books',
                    //                         value: 'all'
                    //                     });
                    //             data.forEach(item =>{
                    //                     if(item.Name == 'Standard Price Book' || item.Name == 'CPQ Standard Sales'){
                    //                         priceBookOption.push({
                    //                             label: item.Name,
                    //                             value: item.Id
                    //                         });
                    //                     }
                    //                 })
                    //             this.priceBook = priceBookOption;
                    //             this.showSpinner = false;
                    //     })
                    //     .catch((error) => {
                    //         this.showSpinner = false;
                    //         console.log('getPriceBook error====>', error);
                    //     })

                }
                
                
        

    getPickListValueList(){
        getPickListValue()
            .then((data) => {
                if(data){
                    const pickFieldMap = data;
                    this.fieldList.forEach(field =>{
                        if (field.isPicklist) {
                                let picklistMap =  pickFieldMap[field.label];
                                for (var key in picklistMap) {
                                        let picklist = {
                                            label: picklistMap[key],
                                            value: picklistMap[key]
                                        }
                                    field.picklistValues.push(picklist);
                                }
                            }
                    })
                }
            })
            .catch((error) => {
                console.log('getPickListValueList error====>', error);
            })

    }

    handleAddFilter() {
        const All_Compobox_Valid = [...this.template.querySelectorAll('lightning-combobox')]
            .reduce((validSoFar, input_Field_Reference) => {
                input_Field_Reference.reportValidity();
                return validSoFar && input_Field_Reference.checkValidity();
            }, true);

            if(All_Compobox_Valid){   
                let newFilter = {
                    index: this.filterFieldList.length,
                    isEdited: true,
                    hasSelected: false,
                    operator: '',
                    selectedValue: '',
                    selectedField: this.fieldList[0],
                    filterStr: ''
                }
                newFilter.selectedField.operator = '';
                newFilter.selectedField.selectedValue = '';
                newFilter.selectedField.startDate = '';
                newFilter.selectedField.endDate = '';
                newFilter.selectedField.startDateTime = '';
                newFilter.selectedField.endDateTime = '';
                newFilter.fieldLabel = newFilter.selectedField.label;
                newFilter.fieldValue = newFilter.selectedField.value;
                
                this.filterFieldList.forEach(item => {
                    item.isEdited = false;
                })
                this.filterFieldList.push(newFilter);
                this.showFilterLogicPart = true;
        }
        else{
            const event = new ShowToastEvent({
                title : 'Error',
                message : 'Please enter the field values',
                variant : 'error'
            });
            this.dispatchEvent(event);
            
        }

    }

    handleChangeField(event) {
        let selectValue = event.detail.value;
        let dataindex = event.target.getAttribute('data-index');

        this.filterFieldList.forEach(item => {
            console.log('Item-->', item);
            item.selectedField.operator = '';
            item.selectedField.selectedValue = '';
            if (dataindex == item.index) {
                item.selectedField = this.fieldList.filter( r => r.value === selectValue)[0];
            }
        })
    }

    handleChangeOperator(event) {
        let dataindex = event.target.getAttribute('data-index');
        this.filterFieldList.forEach(item => {
            if (dataindex == item.index) {
                item.selectedField.operator = event.detail.value;
            }
        })
    }

    handleChangeInput(event) {
        let filterIndex = event.target.getAttribute('data-index');
        this.filterFieldList.forEach(item => {
            if(item.selectedField){
                if (filterIndex == item.index) {
                    if (item.selectedField.isText || item.selectedField.isPicklist || item.selectedField.isDouble) {
                        item.selectedField.selectedValue = event.detail.value;
                    }
                    
                    if (item.selectedField.isDate) {
                        let dataname = event.target.getAttribute('data-name');
                        if (dataname == 'start') {
                            item.selectedField.startDate = event.detail.value;
                        } else {
                            item.selectedField.endDate = event.detail.value;
                        }
                    }
            
                    if (item.selectedField.isDateTime) {
                        let dataname = event.target.getAttribute('data-name');
                        if (dataname == 'start') {
                            item.selectedField.startDateTime = event.detail.value;
                        } else {
                            item.selectedField.endDateTime = event.detail.value;
                        }
                    }
                }
        }
        })
        
    }

    handleSelectFieldDone(event) {
        let filterIndex = event.target.getAttribute('data-index');
        const All_Compobox_Valid = [...this.template.querySelectorAll('lightning-combobox')]
            .reduce((validSoFar, input_Field_Reference) => {
                input_Field_Reference.reportValidity();
                return validSoFar && input_Field_Reference.checkValidity();
            }, true);

        if(All_Compobox_Valid){    
            this.filterFieldList.forEach(item => {
                if(item.selectedField){
                    if (filterIndex == item.index) {
                        if (item.selectedField.isText || item.selectedField.isPicklist || item.selectedField.isDouble) {
                            item.hasSelected = true;
                            item.isEdited = false;
                            item.fieldLabel = item.selectedField.label;
                            item.fieldValue = item.selectedField.value;
                            item.operator = this.allOperators.filter(r => r.value === item.selectedField.operator)[0].label;

                            if (item.selectedField.isPicklist) {
                                let selectedValue = item.selectedField.selectedValue;
                                if (this.listViewMethod == 'Visibility Api') {
                                    item.selectedField.selectedValue = item.selectedField.picklistValues.filter(r => r.value === selectedValue)[0].label;
                                    item.picklistLabel = item.selectedField.selectedValue;
                                } else {
                                    item.picklistLabel = item.selectedField.picklistValues.filter(r => r.value === item.selectedField.selectedValue)[0].label;
                                }
                            }

                            item.selectedValue = item.selectedField.selectedValue;
                            item.filterStr = item.selectedField.value + ' ' + item.selectedField.operator + ' ' + '\'' + item.selectedValue + '\'';
                            if (item.operator == 'contains' || item.operator == 'does not contain') {
                                item.filterStr = item.selectedField.value + ' ' + item.selectedField.operator + ' ' + '\'%' + item.selectedValue + '%\'';
                            }
                            if (item.operator == 'starts with') {
                                item.filterStr = item.selectedField.value + ' ' + item.selectedField.operator + ' ' + '\'' + item.selectedValue + '%\'';
                            }
                            if (item.selectedField.isDouble) {
                                item.filterStr = item.selectedField.value + ' ' + item.selectedField.operator + ' ' + item.selectedValue;
                            }
                            
                        }

                        if (item.selectedField.isDate) {
                            item.hasSelected = true;
                            item.isEdited = false;
                            item.fieldLabel = item.selectedField.label;
                            item.fieldValue = item.selectedField.value;
                            item.operator = 'from ' + item.selectedField.startDate;
                            item.selectedValue = 'to ' + item.selectedField.endDate;
                            item.filterStr = item.selectedField.value + '>=' + item.selectedField.startDate + ' AND ' + item.selectedField.value + '<=' + item.selectedField.endDate;
                        }
                        if (item.selectedField.isDateTime) {
                            item.hasSelected = true;
                            item.isEdited = false;
                            item.fieldLabel = item.selectedField.label;
                            item.fieldValue = item.selectedField.value;
                            item.operator = 'from ' + item.selectedField.startDateTime;
                            item.selectedValue = 'to ' + item.selectedField.endDateTime;
                            item.filterStr = item.selectedField.value + '>=' + item.selectedField.startDateTime + ' AND ' + item.selectedField.value + '<=' + item.selectedField.endDateTime;
                        }
                    }
                }
            })
        }
        else{
            const event = new ShowToastEvent({
                title : 'Error',
                message : 'Please enter the field values',
                variant : 'error'
            });
            this.dispatchEvent(event);
            
        }
    }

    // handleChangePriceBook(event){
    //     this.showSpinner = true;
    //     var dataCheckList = JSON.parse(JSON.stringify(this.fullData));
    //     if(event.detail.value == 'all'){
    //         this.priceBookProductList=[];
    //         var i = 1;
    //         for(let record of dataCheckList){
    //             record.rowNumber = i;
    //             this.priceBookProductList.push(record);
    //             i++;
    //         }
    //         this.showSpinner = false;
    //     }
    //     else{
    //         getProductFromPriceBookId({pricebookId: event.detail.value})
    //             .then((data) => {
    //                 this.priceBookProductList=[];
    //                 var i=1;
    //                 data.forEach(item =>{
    //                     for(let record of dataCheckList){
    //                         if(record.Id == item){
    //                             record.rowNumber = i;
    //                             this.priceBookProductList.push(record);
    //                             i++;
    //                         }
    //                     }
    //                 })
    //                 this.showSpinner = false;
    //             })
    //             .catch((error) => {
    //                 console.log('getProductFromPriceBookId error====>', error);
    //             })
    //     }

    //     this.pricebookVal = event.detail.value;
    //     this.priceBookLabelVal = event.target.options.find(opt => opt.value === event.detail.value).label;

    // }

    handleSaveFilter() {
        // const priceBookValue = new CustomEvent("getpricebookvalue", {detail: this.pricebookVal});
        // this.dispatchEvent(priceBookValue);

        // const pricelabel = new CustomEvent("getpricebooklabel", {detail: this.priceBookLabelVal});
        // this.dispatchEvent(pricelabel);

        const filterList = new CustomEvent("getfilterlist", {detail: this.filterFieldList});
        this.dispatchEvent(filterList);

        // const productList = new CustomEvent("getproductlist", {detail: this.priceBookProductList});
        // this.dispatchEvent(productList);

        var searchRecords = [];
        var recordsToCheck = this.records;
        console.log('recordsToCheck1-->', recordsToCheck);
        // if(this.priceBookProductList != null && this.priceBookProductList && this.priceBookProductList != [] && this.priceBookProductList.length != 0){
        //     recordsToCheck = this.priceBookProductList;
        // }
        // else{
            // recordsToCheck = JSON.parse(JSON.stringify(this.fullData));
        // }
        this.filterFieldList.forEach(item => {
            console.log('item-->', item);
            var val = item.fieldValue;
            searchRecords = [];
            var searchKey = item.selectedValue.toLowerCase();
            if(item.operator == 'equals'){
                // var i = 1;
                        for(let record of recordsToCheck){
                            console.log('record to check-->',record);
                            // if(item.selectedField.isDouble || item.selectedField.isPicklist){
                            //     if(record[val] == searchKey){
                            //         record.rowNumber = i;
                            //         searchRecords.push(record);
                            //         i++;
                            //     }
                            // }
                            // else{
                                if(String(record[val]).toLowerCase() == searchKey){
                                    // record.rowNumber = i;
                                    searchRecords.push(record);
                                    // i++;
                                }
                            // }   
                        }
            }
            else if(item.operator == 'not equal to'){
                // var i = 1;
                        for(let record of recordsToCheck){
                            // if(item.selectedField.isDouble || item.selectedField.isPicklist){
                            //     if(record[val] != searchKey){
                            //         record.rowNumber = i;
                            //         searchRecords.push(record);
                            //         i++;
                            //     }
                            // }
                            // else{
                                if(String(record[val]).toLowerCase() != searchKey){
                                    // record.rowNumber = i;
                                    searchRecords.push(record);
                                    // i++;
                                }
                            // }   
                        }
            }

            else if(item.operator == 'contains'){
                // var i = 1;
                        for(let record of recordsToCheck){
                            console.log('record to check-->',record);
                            if(String(record[val]).toLowerCase().includes(searchKey)){
                                // record.rowNumber = i;
                                searchRecords.push(record);
                                // i++;
                            }
                                
                        }
            }

            else if(item.operator == 'does not contain'){
                // var i = 1;
                        for(let record of recordsToCheck){
                            if(!(String(record[val]).toLowerCase().includes(searchKey))){
                                // record.rowNumber = i;
                                searchRecords.push(record);
                                // i++;
                            }
                                
                        }
            }

            else if(item.operator == 'starts with'){
                // var i = 1;
                        for(let record of recordsToCheck){
                            if(String(record[val]).toLowerCase().startsWith(searchKey)){
                                // record.rowNumber = i;
                                searchRecords.push(record);
                                // i++;
                            }
                                
                        }
            }

            else if(item.operator == 'less than'){
                // var i = 1;
                        for(let record of recordsToCheck){
                            if(record[val] < searchKey){
                                // record.rowNumber = i;
                                searchRecords.push(record);
                                // i++;
                            }
                                
                        }
            }

            else if(item.operator == 'greater than'){
                // var i = 1;
                        for(let record of recordsToCheck){
                            if(record[val] > searchKey){
                                // record.rowNumber = i;
                                searchRecords.push(record);
                                // i++;
                            }
                                
                        }
            }

            else if(item.operator == 'less or equal'){
                // var i = 1;
                        for(let record of recordsToCheck){
                            if(record[val] <= searchKey){
                                // record.rowNumber = i;
                                searchRecords.push(record);
                                // i++;
                            }
                                
                        }
            }

            else if(item.operator == 'greater or equal'){
                // var i = 1;
                        for(let record of recordsToCheck){
                            if(record[val] >= searchKey){
                                // record.rowNumber = i;
                                searchRecords.push(record);
                                // i++;
                            }
                                
                        }
            }

            recordsToCheck = searchRecords;

        })
        console.log('recordsToCheck-->', recordsToCheck);
        const filterListValue = new CustomEvent("getfiltervalue", {detail: recordsToCheck});

        this.dispatchEvent(filterListValue);
        this.handleCloseFilter();
    }

    handleCloseFilter() {
        this.dispatchEvent(
            new CustomEvent('closefilter', {
                
            })
        );
    }

    handleRemoveAll() {
        this.filterFieldList = [];
        this.showFilterLogicPart = false;
    }

    handleRemoveCurrentFilter(event) {
        let dataindex = event.target.getAttribute('data-index');
        console.log('current item-->', this.filterFieldList[dataindex]);
        this.filterFieldList[dataindex].selectedField.operator = '';
        this.filterFieldList[dataindex].selectedField.selectedValue = '';
        this.filterFieldList.splice(dataindex, 1);
        this.filterFieldList.forEach((item, index) => {
            item.index = index;
        })
        if (this.filterFieldList.length == 0) {
            this.showFilterLogicPart = false;
        }
    }

}