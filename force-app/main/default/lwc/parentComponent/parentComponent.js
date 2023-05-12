import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {

    // property to display a message on the parent component
    childSaid;

    // method to handle the event raised by the child
    handleFit() {
        if (this.childSaid) {
            this.childSaid = null;
        } else {
            this.childSaid = 'Waaaaaaaaa!!';
        }
    }

    constructor() {
        super();
        console.log('Parent: constructor...');
    }

    disconnectedCallback() {
        console.log('Parent: disconnectedCallback...');
    }

    connectedCallback() {
        console.log('Parent: connectedCallback...');
    }

    renderedCallback() {
        console.log('Parent: renderedCallback...');
    }

    errorCallback(error) {
        console.error('Parent: errorCallback')
        console.error(error);
    }
}
