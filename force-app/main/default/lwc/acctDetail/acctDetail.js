import { LightningElement, wire } from 'lwc';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AcctDetail extends LightningElement {

    accountId;                  // property to hold the account ID received from the message channel
    accountName;                // property to hold the account Name received from the message channel
    subscription = {};          // property to hold the subscription object returned from subscribe

// getter method to display a meaningful label in the Detail component
    get detailLabel() {
        return `Details for ${this.accountName}`;
    }


    @wire(MessageContext)
    messageContext;

    // create a method to subscribe to the message channel
    subscribeToMessageChannel() {
        this.subscription = subscribe(this.messageContext, AccountMC, (message) => this.handleMessage(message));
    }

    // create a method to unsubscribe from the messsage channel
    unsubscribeFromMessageChannel() {
        unsubscribe(this.subscription);
    }

    // create a method to handle the message received from the message channel
    handleMessage(message) {
        this.accountId = message.recordId;
        this.accountName = message.accountName;
        console.log('Message received and handled: ' + this.accountId + this.accountName);
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeFromMessageChannel();
    }

    detailSaved() {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Account Updated',
            message: 'Account was successfully updated!',
            variant: 'success',
            mode: 'dismissible'
        }));
    }
}
