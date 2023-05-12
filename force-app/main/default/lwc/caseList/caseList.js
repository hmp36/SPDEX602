import { LightningElement, api, wire } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class CaseList extends LightningElement {

    @api recordId;

    casesToDisplay = false;
    cases;

    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'Cases',
        fields: ['Case.Id', 'Case.CaseNumber', 'Case.Subject', 'Case.Status', 'Case.Priority']
    })
    wiredCases({data, error}){
        if (data) {
            this.cases = data.records;
            this.dispatchEvent(new CustomEvent('casecount', { detail: this.cases.length}));
            this.casesToDisplay = this.cases.length > 0 ? true : false;
        }

        if (error) {
            console.error('Error occurred retrieving Case records...');
        }
    }
}
