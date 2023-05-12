import { LightningElement, api } from 'lwc';
import GenWattStyle from '@salesforce/resourceUrl/GenWattStyle';
import { loadStyle } from 'lightning/platformResourceLoader';

export default class HelloWorld extends LightningElement {

    // public property
    @api firstName = 'World';

    // create a constructor method
    constructor() {
        // first must call super() to establish the prototype chain
        super();

        // make a call to loadStyle and have it load my static resource (ESS) in this instance of my class
       loadStyle(this, GenWattStyle)
          .then(() => {console.log('Hello World:  Style sheet loaded')})
          .catch((error) => {console.log('Hello World: Error loading style sheet')});
    }

    
}
