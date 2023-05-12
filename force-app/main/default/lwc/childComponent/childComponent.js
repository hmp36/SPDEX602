import { LightningElement, api } from 'lwc';

export default class ChildComponent extends LightningElement {

    // define two public properties
    @api childName;
    @api age;

    // method to dispatch an event to the parent
    respondToParent() {

        // create custom event
        const myEvent = new CustomEvent('crying');

        // dispatch my custom event
        this.dispatchEvent(myEvent);
    }

    constructor() {
        super();
        console.log('Child: constructor...');
    }

    disconnectedCallback() {
        console.log('Child: disconnectedCallback...');
    }

    connectedCallback() {
        console.log('Child: connectedCallback...');
    }

    renderedCallback() {
        console.log('Child: renderedCallback...');
        throw new Error('Child has an error');
    }
}
