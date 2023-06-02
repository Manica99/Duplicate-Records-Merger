import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// import getDupLeadRec from '@salesforce/apex/BulkifyLeadObject.getDupLeadRec';
import getDupDynamicLeadRec from '@salesforce/apex/BulkifyLeadObject1.getFieldValues';
import handleAllMerge from '@salesforce/apex/BulkifyLeadObject1.handleAllMerge';


let firstTimeEntry = false;
export default class BulkifyLeadComponent1 extends LightningElement {
    //data;
    // columns = columns;
    selectedname;
    isShow = false;

    @api firstColumnAsRecordHyperLink = 'Yes';
    @track tableData;
    @track fieldMap;
    @track columns;
    @track detailPage = false;
    @track value; // row name 
    @track listViewFilter;
    @track childDataFull;
    @track filterList = [];
    @track fliterRecords = [];
    @track records;
    @track currentPage = 1;
    @track totalRecords = 0;
    @track pageSize = 10;
    @track totalPages = 0;
    @track recordStart = 1;
    @track recordEnd = 10;
    @track recordList = []; // all records

    get options() {
        return [
            { label: '10', value: '10' },
            { label: '30', value: '30' },
            { label: '60', value: '60' },
            { label: '100', value: '100' }
        ];
    }

    get bDisableFirst() {
        return this.recordStart === 1;
    }

    get bDisableLast() {
        return this.recordEnd === this.totalRecords;
    }

    connectedCallback() {
        // var obj;
        // var arr = [];
        firstTimeEntry = false;

        getDupDynamicLeadRec({})
            .then((data) => {
                //if (data.length > 0) {
                    console.log('Data =>', data);
                    this.childDataFull = data;
                    let items = [];
                    this.fieldMap = data.fieldMap;
                    items.push({ label: '', fieldName: 'rowNumber', type: 'number', fixedWidth: 50 });
                    for (var key in this.fieldMap) {
                        // if (this.firstColumnAsRecordHyperLink != null && this.firstColumnAsRecordHyperLink == 'Yes' && firstTimeEntry == false) {
                        //     // firstFieldAPI = key;
                        //     items = [...items,
                        //     {
                        //         label: key,
                        //         fieldName: 'URLField',
                        //         editable: false,
                        //         showRowNumberColumn: false,
                        //         type: 'url',
                        //         typeAttributes: {
                        //             label: {
                        //                 fieldName: key
                        //             },
                        //             tooltip: {
                        //                 fieldName: key
                        //             },

                        //             target: '_blank'
                        //         },
                        //         sortable: true
                        //     }];
                        //     firstTimeEntry = true;
                        // }

                        //     else{
                        items = [...items, {
                            label: key,
                            fieldName: key,
                            editable: false,
                            showRowNumberColumn: false,
                            type: (key == 'IsActive') ? 'checkbox' : 'text'
                        }];
                        // }
                    }

                    items.push({
                        label: 'Duplicate', fieldName: 'Duplicate', type: 'button', title: 'abc',
                        typeAttributes: {
                            label: {
                                fieldName: 'Duplicate'
                            },
                            variant: 'base',
                            target: 'abc'
                        },
                    });
                    this.columns = items;
                    this.recordList = data.recordList;
                    this.handleData();
                    // if (data.length > 0) {
                    //     data.forEach(currentItem => {
                    //         obj = ({ ...currentItem, isChildShow: false });
                    //         arr.push(obj);
                    //     });
                    //     this.data = arr;
                    // }
                //}
            })
            .catch(error => {
                console.log('error-----', error);
                this.tableData = undefined;
            })


    }


    handleCloseChild(event) {
        this.detailPage = false;
        window.location.reload();
    }
    // this.isShow=event.detail;
    // this.data.map(currentItem => {
    //     if (currentItem.Name == this.detail) {
    //             currentItem.isChildShow = false;

    //     }

    // });

    handleData() {
        this.currentPage = 1;
        var i = 1;
        for (var row in this.recordList) {
            this.recordList[row].rowNumber = i;
            i++;
        }
        // this.tableData = recordList;
        this.totalRecords = i - 1;
        this.totalPages = (Math.ceil(Number(this.totalRecords) / Number(this.pageSize)));
        this.recordEnd = 10;
        this.recordStart = 1;

        this.paginationHelper();
        this.handlePageList();
    }

    handlePageList() {
        this.pageList = [];
        var j = Math.ceil(Number(this.currentPage) / 7);

        if (7 * j <= Number(this.totalPages)) {
            for (var i = (7 * j) - 6; i <= (7 * j); i++) {
                if (i == this.currentPage) {
                    this.pageList.push({
                        class: 'pageListSelectedClass',
                        value: i
                    });
                }
                else {
                    this.pageList.push({
                        class: 'pageListClass',
                        value: i
                    });
                }
            }
        }

        else {
            for (var i = (7 * j) - 6; i <= (Number(this.totalPages)); i++) {
                if (i == this.currentPage) {
                    this.pageList.push({
                        class: 'pageListSelectedClass',
                        value: i
                    });
                }
                else {
                    this.pageList.push({
                        class: 'pageListClass',
                        value: i
                    });
                }
            }
        }

    }

    handleMergeAll() {
        console.log('tableData====>', this.recordList);
        var recordNames = [];
        this.recordList.map(val => {
            recordNames.push(val.Name);
        })
        console.log('Name List===>', recordNames);
        handleAllMerge({ listName: recordNames, pageSize: this.pageSize })
            .then((data) => {  
                if(data!=''){
                    const event = new ShowToastEvent({
                    title: 'Toast message',
                    message: 'Duplicated has been merged.',
                    variant: 'success',
                    mode: 'dismissable'
                    });
                     this.dispatchEvent(event);
                     window.location.reload();
                }
            })
    }

    handleChangeInRow(event) {
        this.closeCheck = true;
        this.handleback();
        this.currentPage = 1;
        this.recordStart = 1;
        this.pageSize = event.target.value;
        this.totalPages = (Math.ceil(Number(this.totalRecords) / Number(this.pageSize)));
        this.handlePageList();
        if (this.pageSize <= this.totalRecords) {
            this.recordEnd = event.target.value;
        }
        else {
            this.recordEnd = this.totalRecords;
        }
        this.paginationHelper();
    }

    processMe(event) {
        this.closeCheck = true;
        this.handleback();
        this.currentPage = event.target.label;
        if (Number(this.currentPage) < Number(this.totalPages)) {
            this.handlePageList();
            this.recordStart = (Number(this.currentPage) - 1) * Number(this.pageSize) + 1;
            this.recordEnd = (Number(this.currentPage)) * Number(this.pageSize);
        }
        else {
            this.handleLast();
        }
        this.paginationHelper();
    }

    handleNext() {
        this.closeCheck = true;
        this.handleback();
        this.currentPage = this.currentPage + 1;

        if ((Number(this.recordEnd) + Number(this.pageSize) <= this.totalRecords)) {
            this.recordStart = Number(this.recordStart) + Number(this.pageSize);
            this.recordEnd = Number(this.recordEnd) + Number(this.pageSize);
        }
        else {
            this.recordStart = Number(this.recordStart) + Number(this.pageSize);
            this.recordEnd = this.totalRecords;
        }

        this.handlePageList();
        this.paginationHelper();
    }

    handlePrev() {
        this.closeCheck = true;
        this.handleback();
        this.currentPage = this.currentPage - 1;
        if ((Number(this.recordStart) - Number(this.pageSize) >= 1)) {
            this.recordEnd = Number(this.recordStart) - 1;
            this.recordStart = Number(this.recordStart) - Number(this.pageSize);
        }
        else {
            this.recordEnd = Number(this.recordEnd) - Number(this.pageSize);
            this.recordStart = 1;
        }
        this.handlePageList();
        this.paginationHelper();
    }

    handleLast() {
        this.closeCheck = true;
        this.handleback();
        this.currentPage = this.totalPages;
        if ((Number(this.totalRecords) % Number(this.pageSize)) == 0) {
            this.recordStart = ((Math.floor(Number(this.totalRecords) / Number(this.pageSize))) - 1) * this.pageSize + 1;
        }
        else {
            this.recordStart = (Math.floor(Number(this.totalRecords) / Number(this.pageSize))) * this.pageSize + 1;
        }
        this.recordEnd = this.totalRecords;
        this.handlePageList();
        this.paginationHelper();
    }

    handleFirst() {
        this.closeCheck = true;
        this.handleback();
        this.currentPage = 1;
        this.recordStart = 1;
        this.recordEnd = this.pageSize;
        this.handlePageList();
        this.paginationHelper();
    }

    paginationHelper() {
        var recordToDisplay = [];
        console.log('this.recordStart : ', this.recordStart);
        console.log('this.recordEnd : ', this.recordEnd);
        for (let i = (this.recordStart) - 1; i < this.recordEnd; i++) {
            recordToDisplay.push(this.recordList[i]);
        }
        console.log('this.recordToDisplay : ', recordToDisplay);
        this.tableData = recordToDisplay;

        if (this.firstColumnAsRecordHyperLink != null && this.firstColumnAsRecordHyperLink == 'Yes') {
            // let URLField;
            let Duplicate;
            this.tableData = recordToDisplay.map(item => {
                // URLField = '/lightning/r/' + 'Lead' + '/' + item.Id + '/view';
                Duplicate = 'Duplicate';
                // item = { ...item, URLField };
                return { ...item, Duplicate };
            });

            // this.tableData = this.tableData.filter(item => item.fieldPath != firstFieldAPI);
        }
    }

    async onAction(event) {
        console.log('Id diff-->', event.detail.row.Name);
        this.value = event.detail.row.Name;
        this.subTableStyle = 'position: absolute;right: 0;top:' + this.subTableTop + 'px;z-index:2;';
        this.detailPage = !(this.detailPage);
    }

    handleback(event) {
        this.detailPage = false;
    }

    mouseLocationDiv(evt) {
        this.subTableTop = evt.pageY;
        this.subTableTop -= 116;
    }

    handleChange(event) {
        var id = event.currentTarget.dataset.id;
        console.log('id:--', id);
        // this.data.map(currentItem => {
        //     if (currentItem.Name == id) {
        //         currentItem.isChildShow = true;
        //     }
        //     else {
        //         currentItem.isChildShow = false;
        //     }
        // });
        console.log('Val===>', this.data);
        // this.isShow = !this.isShow;
        this.selectedname = id;
    }

    handleFilter() {
        this.listViewFilter = !this.listViewFilter;
    }

    handelFilterValue(event) {
        this.fliterRecords = [];
        this.fliterRecords = JSON.parse(JSON.stringify(event.detail));
        this.recordList = this.fliterRecords;
        this.currentPage = 1;
        this.totalRecords = this.fliterRecords.length;
        this.totalPages = (Math.ceil(Number(this.totalRecords) / Number(this.pageSize)));
        this.recordStart = 1;
        if (this.totalRecords > this.pageSize) {
            this.recordEnd = this.pageSize;
        }
        else {
            this.recordEnd = this.totalRecords;
        }
        this.paginationHelper();
        this.handlePageList();
        console.log('Filter records-->', JSON.parse(JSON.stringify(event.detail)));
    }

    handleCloseFilter() {
        this.listViewFilter = false;
    }

    handleSavedFilterList(event) {
        this.filterList = [];
        this.filterList = JSON.parse(JSON.stringify(event.detail));
        console.log('filterList-->', this.filterList);
    }

}