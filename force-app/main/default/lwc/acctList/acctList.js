import { LightningElement, wire } from 'lwc';
import getTopAccounts from '@salesforce/apex/AccountController.getTopAccounts';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';

export default class AcctList extends LightningElement {

    records;            // property to hold the account records returned
    selectedAccount;    // property to hold the selected account ID
    selectedName;       // property to hold the selected account Name

    // wire up the MessageContext class to create a MessageContext object to pass to the publish method
    @wire(MessageContext)
    messageContext;         // creating a property to hold the MessageContext object


    // wire up the getTopAccounts and return the results into a method
    @wire(getTopAccounts)
    wiredAccounts({data, error}) {
        if (data) {
            this.records = data;
	this.selectedAccount = this.records[0].Id;
            this.selectedName = this.records[0].Name;
            this.sendMessageService(this.selectedAccount, this.selectedName);

        }

        if (error) {
            this.records = undefined;
            console.error('Error occurred retrieving account records...');
        }
    }

    // create a method to handle a selected event from acctCard
    handleSelection(event) {
        this.selectedAccount = event.detail.acctid;
        this.selectedName = event.detail.acctname;
        this.sendMessageService(this.selectedAccount, this.selectedName);
    }

    // create a method to publish the account ID and Name to the message channel
    sendMessageService(accountId, accountName) {
        // invoke the publish method to publish my account info to the message channel
        publish(this.messageContext, AccountMC, { recordId: accountId, accountName: accountName} );
        console.log('Published a message with info: ' + accountId + ' ' + accountName);
    }
}




