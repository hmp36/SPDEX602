import { LightningElement, api, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';
import { refreshApex } from '@salesforce/apex';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import { subscribe, unsubscribe } from 'lightning/empApi';
import OPP_NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import OPP_AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import OPP_CLOSEDATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class OpportunityList extends LightningElement {

    // create a public property to inherit the record ID from the record page
    @api recordId;

    displayedOpps = [];             // array to hold the record to display in the UI
    allOpps = [];                   // array to hold ALL opp records returned
    results;                        // property to hold the provisioned object returned from the wire service
    status;                         // property to hold the value selected in our combobox
    recordsToDisplay = false;       // boolean property to determine if we have records to display or not
    totalRecords;                   // property to hold the number of records being displayed
    totalAmount;                    // property to hold the sum of all opp amounts being displayed
    wiredPicklistOptions = [];      // property to hold the picklist values returned from the wire service
    channelName = '/topic/Opportunities';   // property to hold the push topic channel we will be subscribing to
    subscription = {};              // property to hold the subscription object returned from the subscribe method
    tableMode = false;              // property to determine which view to display the records
    cardChecked = true;             // property to determine whether to display a check mark for Card
    tableChecked = false;           // property to determine whether to display a check mark for Table
    myDrafts = [];                  // property to hold the draft values in the datatable

    // array of column information for our datatable
    columns = [
        { label: 'Opportunity Name', fieldName: OPP_NAME_FIELD.fieldApiName, type: 'text', editable: true },
        { label: 'Amount', fieldName: OPP_AMOUNT_FIELD.fieldApiName, type: 'currency', editable: true },
        { label: 'Stage', fieldName: STAGE_FIELD.fieldApiName, type: 'text' },
        { label: 'Close Date', fieldName: OPP_CLOSEDATE_FIELD.fieldApiName, type: 'date' }
    ];

    stageOptions = [
        { value: 'All', label: 'All' },
        { value: 'Open', label: 'Open' },
        { value: 'Closed', label: 'Closed' }
        // { value: 'ClosedWon', label: 'Closed Won'},
        // { value: 'ClosedLost', label: 'Closed Lost'}
    ];

    get comboOptions() {
        return this.stageOptions.concat(this.wiredPicklistOptions);
    }

    // wire up the getPicklistValues method and return the values and labels for the Stage field
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: STAGE_FIELD })
    wiredPicklist({ data, error }) {
        if (data) {
            for (let item of data.values) {
                this.wiredPicklistOptions.push({ value: item.value, label: item.label });
            }
        }
        if (error) {
            console.log('Error occurred retrieving picklist values....');
        }
    }

    @wire(getOpportunities, { accountId: '$recordId' })
    wiredOpps(oppRecords) {
        this.results = oppRecords;      // move the provisioned object into a property so I can refresh later

        // check to see if we got data or error
        if (this.results.data) {
            // this.displayedOpps = this.results.data;     // move the data into the displayedOpps array
            this.allOpps = this.results.data;           // move the data into the allOpps array
            this.updateList();
        }

        if (this.results.error) {
            console.error('Error occurred retrieving opps...');
        }
    }

    // method to handle the change in value from the combobox
    handleChange(event) {
        this.status = event.detail.value;       // take the value selected from the event
        this.updateList();                      // call a method to update the list of opps to display
    }

    // method to update the list of opps to display in the UI based off of the value of status
    updateList() {
        this.displayedOpps = [];            // clear out the displayedOpps array
        let currentRecord = {};

        // check to see if the status is All, and if so, move all records into displayedOpps
        if (this.status === 'All' || !this.status) {
            this.displayedOpps = this.allOpps;  // move the full array of records into displayedOpps
        } else {
            // iterate over the records, check them against the status, and add to displayedOpps as needed
            for (let i = 0; i < this.allOpps.length; i++) {

                currentRecord = this.allOpps[i];  // create a variable to hold the current record

                if (this.status === 'Open') {
                    if (!currentRecord.IsClosed) {
                        this.displayedOpps.push(currentRecord);
                    }
                } else if (this.status === 'Closed') {
                    if (currentRecord.IsClosed) {
                        this.displayedOpps.push(currentRecord);
                    }
                } else if (this.status === currentRecord.StageName) {
                    this.displayedOpps.push(currentRecord);
                }
            }
        }

        // once records to display have been moved into displayedOpps, let determine if we have any records to display
        this.recordsToDisplay = this.displayedOpps.length > 0 ? true : false;

        this.totalRecords = this.displayedOpps.length;
        this.totalAmount = this.displayedOpps.reduce((prev, curr) => prev + (isNaN(curr.Amount) ? 0 : curr.Amount), 0);

    }

    // create a method to refresh the cache of Opp records
    refreshWire() {
        refreshApex(this.results);          // pass the property that is holding the provisioned object
    }

    // create a method to subscribe to my push topic on the Streaming API
    handleSubscribe() {

        const messageCallback = response => {
            if (response.data.event.type === 'deleted') {
                if (this.allOpps.find(elem => { return elem.Id === response.data.sobject.Id })) {
                    this.refreshWire();
                }
            } else {
                if (response.data.sobject.AccountId === this.recordId) {
                    this.refreshWire();
                }
            }
        }
        // use the subscribe method to subscribe to our push topic
        subscribe(this.channelName, -1, messageCallback)
            .then(response => { this.subscription = response });
    }

    // create a method to unsubscribe from my push topic on the Streaming API
    handleUnsubscribe() {
        // unsubscribe from the channel
        unsubscribe(this.subscription, response => { console.log('Unsubscribed successfully') });
    }

    connectedCallback() {
        this.handleSubscribe();
    }

    disconnectedCallback() {
        this.handleUnsubscribe();
    }

    // create a method to handle the selection from the button menu
    handleToggle(evt) {
        const selection = evt.detail.value;

        if (selection === 'card') {
            this.tableMode = false;
            this.cardChecked = true;
            this.tableChecked = false;
        } else if (selection === 'table') {
            this.tableMode = true;
            this.cardChecked = false;
            this.tableChecked = true;
        }
    }

    // method to take the draft values submitted from the datatable save event, and update the records in the database
    handleTableSave(event) {
        // move the draft values from the event into my property
        this.myDrafts = event.detail.draftValues;
        console.log(this.myDrafts);
        // change the field values on the records from the draft values and place them in an array variable
        const inputItems = this.myDrafts.slice().map(draft => {
            var fields = Object.assign({}, draft);
            return { fields };
        });

        console.log(inputItems);

        // create a list of Promises to hold calls to the updateRecord method for each record changed
        const promises = inputItems.map(recordInput => updateRecord(recordInput));
        Promise.all(promises)
            .then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success!',
                        message: 'Successfully updated the records.',
                        variant: 'success',
                        mode: 'dismissible'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error!',
                        message: 'Error occurred updating records.',
                        variant: 'error',
                        mode: 'dismissible'
                    })
                );
            }
            )
            .finally(result => {
                this.myDrafts = [];
                console.log('Finally');
            });
    }
}
