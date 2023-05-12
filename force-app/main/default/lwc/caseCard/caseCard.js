import { LightningElement, api } from 'lwc';

export default class CaseCard extends LightningElement {

    @api caseId;
    @api caseNumber;
    @api subject;
    @api status;
    @api priority;
    
}
