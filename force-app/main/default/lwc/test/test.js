import { LightningElement, track } from 'lwc';



export default class Test extends LightningElement {
    @track greeting= "Kami Sama";
    greetUser(event){
        let txtInput = this.template.querySelector(".txtInput");
        this.greeting = txtInput.value;
    }
}