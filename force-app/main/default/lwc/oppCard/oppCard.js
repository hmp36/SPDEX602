import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import RecordModal from 'c/recordModal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OppCard extends NavigationMixin(LightningElement) {

    // create public properties to hold the Opp record field values
    @api name;              // Opp Name
    @api amount;            // Opp Amount
    @api stage;             // Opp StageName
    @api closeDate;         // Opp CloseDate
    @api oppId;             // Opp Id

    // create a method to navigate to the full Opportunity record
    viewRecord() {
        // call the Navigate method of the NavigationMixin class and pass in some parameters
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.oppId,
                actionName: 'view'
            }
        });
    }

    // create a method to open the recordModal
    editOpp() {
        RecordModal.open({
            size: 'small',
            recordId: this.oppId,
            objectApiName: 'Opportunity',
            formMode: 'edit',
            layoutType: 'Compact',
            headerLabel: 'Edit Opportunity'
        }).then((result) => {
            console.log(result);
            // check to see if the result is modsuccess, and if so, dispatch a toast event
            if (result == 'modsuccess') {
                // dispatch a toast event
                this.dispatchToast(
                    'Opportunity Saved Successfully',
                    'The opportunity record was saved successfully',
                    'success',
                    'dismissible'
                );

                // dispatch a custom event to tell opportunityList to refresh the records
                const savedEvent = new CustomEvent('modsaved');
                this.dispatchEvent(savedEvent);
            }
        });
    }

    // create a method to dispatch a toast event
    dispatchToast(title, message, variant, mode){
        // create a Toast Event
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });

        // dispatch my Toast Event
        this.dispatchEvent(toastEvent);
    }

}
