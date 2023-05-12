import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class RecordModal extends LightningModal {

    // public properties to hold values for displaying/editing/creating a record
    @api recordId;
    @api objectApiName;
    @api formMode;
    @api layoutType;
    @api headerLabel;

    // method to handle the cancel event
    handleCancel() {
        this.close('modcancel');
    }

    // method to handle the success event
    handleSuccess() {
        this.close('modsuccess');
    }
}

