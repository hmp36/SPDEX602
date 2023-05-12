import getContactList from '@salesforce/apex/ContactController.getContactList';
import { LightningElement, api } from 'lwc';

export default class AcctCard extends LightningElement {

    // properties to hold the field values passed in
    @api name;
    @api annualRevenue;
    @api phone;
    @api acctId;
    @api rank;

    // getter method to return a ranking
    get ranking() {
        const acctRank = this.rank + 1;
        return `${acctRank}.  `;
    }

    // create a method to notify parent of selection
    handleSelect() {
        // create a custom event, and pass the account ID and Name in the event
        const myEvent = new CustomEvent('selected', { detail: { 'acctid': this.acctId, 'acctname': this.name}});
        console.log('Account Card dispatching a selected event...');
        // dispatch my custom event
        this.dispatchEvent(myEvent);
    }
    
    //  create a method to handle displaying the contacts
    displayContacts()  {
        if (this.showContacts) {
            this.showContacts = false;
        } else {
            // invoke the getContactList method
            getContactList({accountId: this.acctId})
                .then
    }

    }
}
