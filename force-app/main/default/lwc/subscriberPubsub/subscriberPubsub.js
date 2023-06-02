import { LightningElement , track} from 'lwc';
import pubsub from 'c/pubsub';

export default class SubscriberPubsub extends LightningElement {
    @track nameList = [];
    //500Bh000001SgjjIAC
    connectedCallback(){
        this.register();
    }

    register(){
        pubsub.register("testEvent",this.handleEvent.bind(this));
    }

    handleEvent(messageFromEvt){
        var msg = messageFromEvt ? JSON.stringify(messageFromEvt,null,"\t"): "";
        console.log('Before',this.nameList);
        this.nameList.push(msg);
        console.log('After',this.nameList);
    }
}