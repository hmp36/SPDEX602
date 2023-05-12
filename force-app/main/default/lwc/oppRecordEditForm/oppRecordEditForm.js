import { LightningElement, api } from 'lwc';
import ACCOUNT_FIELD from '@salesforce/schema/Opportunity.AccountId';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import CLOSEDATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';

export default class OppRecordEditForm extends LightningElement {

    // public properties to inherit the record context
    @api recordId;
    @api objectApiName;

    // create a boolean property to determine which form to display the record
    editMode = false;

    // create properties to hold the field information that was imported
    accountField = ACCOUNT_FIELD;
    nameField = NAME_FIELD;
    amountField = AMOUNT_FIELD;
    closeDateField = CLOSEDATE_FIELD;
    stageField = STAGE_FIELD;

    //  create a method to toggle to edit mode
    toggleMode() {
        this.editMode = !this.editMode;
    }
}
