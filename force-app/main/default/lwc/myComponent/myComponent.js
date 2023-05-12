import { LightningElement } from 'lwc';

export default class MyComponent extends LightningElement {
 
    //  private boolean property to determine conditional display
    showContacts = false;

    //create an array property to hold some contact objects 
contacts=[
{Id:'111',Name:'John', }

    ];
    //  create a method to handle the button click and toggle the value of showContacts
    toggleView() {
        this.showConacts = !this.showContacts;        //toggling a booleon value
    }

}