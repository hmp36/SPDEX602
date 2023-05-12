import { LightningElement, api } from 'lwc';

export default class OppRecordForm extends LightningElement {

    // create two public properties to inherit the record context from the record page
    @api recordId;
    @api objectApiName;

    // create public properties to hold layout type and mode
    @api layoutType = 'Compact';
    @api formMode = 'readonly';


}
