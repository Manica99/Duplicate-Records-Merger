import { LightningElement } from 'lwc';
import pubsub from 'c/pubsub';

export default class PublisherPubsub extends LightningElement { 

    newName = '';

    updateName(event){
        this.newName = event.target.value;
    }

    handleSave(event){
        console.log('OnSave');
        var msg = this.newName
        console.log(msg);
        pubsub.fire('testEvent', msg);
        console.log('saved');
    }

}