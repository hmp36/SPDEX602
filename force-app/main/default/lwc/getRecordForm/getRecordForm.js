import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

// create an array to hold the fields
const FIELDS = [NAME_FIELD, TITLE_FIELD, PHONE_FIELD, EMAIL_FIELD];

export default class GetRecordForm extends LightningElement {

    // property to hold the Contact ID from the page
    @api recordId;

    contact;        // property to hold the contact record
    err;            // property to hold the error from the wire service

    // wire up a property to hold the object provisioned from the wire service when it calls getRecord
    // @wire(getRecord, { recordId: '$recordId', fields: FIELDS}) 
    // contact;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS}) 
    wiredContact({error, data}) {
        if (data) {
            console.log(data);
            this.contact = data;
            this.err = null;
        }

        if (error) {
            console.error(error);
            this.err = error;
            this.contact = null;
        }
    };

    get name() {
        var myStr = this.contact.fields.Name.value;
        return myStr.toUpperCase();
    }

    get title() {
        return this.contact.fields.Title.value;
    }

    get phone() {
        return this.contact.fields.Phone.value;
    }

    get email() {
        return this.contact.fields.Email.value;
    }
}
