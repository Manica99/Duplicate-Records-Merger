import { LightningElement, track } from 'lwc';
import diggResource from '@salesforce/resourceUrl/digg_static_resource';

export default class Dignavigationmenu extends LightningElement {
    @track insightDisplay = false;
    @track setuptDisplay = false;
    @track settingDisplay = false;
    @track dataDisplay = false;
    @track cmo = false;
    @track marketing = false;
    @track channel = false;
    @track cycle = false;
    @track report = false;
    @track ops = false;
    @track path = false;
    @track model = false;
    @track channeltemp = false;
    @track tracker = false;

    iconx1 = "utility:chevrondown";
    iconx2 = "utility:chevrondown";
    iconx3 = "utility:chevrondown";
    iconx4 = "utility:chevrondown";
    diggLogo = diggResource + '/diggicons/digglogo.png';
    insightlogo = diggResource + '/diggicons/insight.png';
    setuplogo = diggResource + '/diggicons/setup.png';
    datalogo = diggResource + '/diggicons/data.png';
    settinglogo = diggResource + '/diggicons/setting.jpg';
    cmologo = diggResource + '/diggicons/cmo.png';
    marketinglogo = diggResource + '/diggicons/marketing.png';
    channelogo = diggResource + '/diggicons/channel.png';
    attributelogo = diggResource + '/diggicons/attribute.png';
    campaignlogo = diggResource + '/diggicons/campaign.png';
    channel_setupogo = diggResource + '/diggicons/channel_setup.png';
    platformlogo = diggResource + '/diggicons/platform.png';
    integrationlogo = diggResource + '/diggicons/integration.png';
    user_managementlogo = diggResource + '/diggicons/user_management.png';
    report = diggResource + '/diggicons/report.png';
    reportP = diggResource + '/diggicons/reportP.png';

    handleInsight(event){
        
        if(this.setupDisplay){
            this.handleSetup(event);
        }

        if(this.settingDisplay){
            this.handleSetting(event);
        }

        if(this.dataDisplay){
            this.handleData(event);
        }

        if(this.insightDisplay){
            this.insightDisplay = false;
            this.iconx1 = "utility:chevrondown";
            this.template.querySelector('.insight').classList.remove('dynamicCSS');
            this.insightlogo = diggResource + '/diggicons/insight.png';
        }
        else if(event.currentTarget.dataset.value == 'insight' && !this.insightDisplay){
            this.insightDisplay = true;
            this.iconx1 = "utility:chevronright"
            this.template.querySelector('.insight').classList.add('dynamicCSS');
            this.insightlogo = diggResource + '/diggicons/insightP.png';
        }
    }

    handleSetup(event){

        if(this.insightDisplay){
            this.handleInsight(event);
        }

        if(this.settingDisplay){
            this.handleSetting(event);
        }

        if(this.dataDisplay){
            this.handleData(event);
        }
        
        if(this.setupDisplay){
            this.setupDisplay = false;
            this.iconx2 = "utility:chevrondown";
            this.template.querySelector('.setup').classList.remove('dynamicCSS');
            this.setuplogo = diggResource + '/diggicons/setup.png';
        }
        else if(event.currentTarget.dataset.value == 'setup' && !this.setupDisplay){
            this.setupDisplay = true;
            this.iconx2 = "utility:chevronright"
            this.template.querySelector('.setup').classList.add('dynamicCSS');
            this.setuplogo = diggResource + '/diggicons/setupP.png';
        }
    }

    handleSetting(event){
        console.log('setting1');
        if(this.insightDisplay){
            this.handleInsight(event);
        }

        if(this.setupDisplay){
            this.handleSetup(event);
        }
        
        if(this.dataDisplay){
            this.handleData(event);
        }
        
        if(this.settingDisplay){ 
            console.log('setting');
            this.settingDisplay = false;
            this.iconx3 = "utility:chevrondown";
            this.template.querySelector('.setting').classList.remove('dynamicCSS');
            this.settinglogo = diggResource + '/diggicons/setting.jpg';
        }
        else if(event.currentTarget.dataset.value == 'setting' && !this.settingDisplay){
            console.log('setting');
            this.settingDisplay = true;
            this.iconx3 = "utility:chevronright"
            this.template.querySelector('.setting').classList.add('dynamicCSS');
            this.settinglogo = diggResource + '/diggicons/settingsP.png';
        }
    }

    handleData(event){

        if(this.insightDisplay){
            this.handleInsight(event);
        }

        if(this.setupDisplay){
            this.handleSetup(event);
        }
        
        if(this.settingDisplay){
            this.handleSetting(event);
        }
        
        if(this.dataDisplay){
            this.dataDisplay = false;
            this.iconx4 = "utility:chevrondown";
            this.template.querySelector('.data').classList.remove('dynamicCSS');
            this.datalogo = diggResource + '/diggicons/data.png';
        }
        else if(event.currentTarget.dataset.value == 'data' && !this.dataDisplay){
            this.dataDisplay = true;
            this.iconx4 = "utility:chevronright"
            this.template.querySelector('.data').classList.add('dynamicCSS');
            this.datalogo = diggResource + '/diggicons/dataP.png';
        }
    }

    handleCMO(event){
        console.log('EVENT-->', event.target.name);
        this.cmo = true;
        this.ops = false;
        this.channeltemp = false;
        if(event.target.name == 'marketing'){
            this.marketing = true;
            this.channel = false;
            this.cycle = false;
            this.report = false;
        }
        if(event.target.name == 'performance'){
            this.marketing = false;
            this.channel = true;
            this.cycle = false;
            this.report = false;
        }
        if(event.target.name == 'cycle'){
            this.marketing = false;
            this.channel = false;
            this.cycle = true;
            this.report = false;
        }
        if(event.target.name == 'report'){
            this.marketing = false;
            this.channel = false;
            this.cycle = false;
            this.report = true;
        }
    }

    handleops(event){
        console.log('EVENT-->', event.target.name);
        this.cmo = false;
        this.ops = true;
        this.channeltemp = false;
        if(event.target.name == 'length'){
            this.path = true;
            this.model = false;
        }
        if(event.target.name == 'model'){
            this.path = false;
            this.model = true;
        }
    }

    handlechannel(event){
        console.log('EVENT-->', event.target.name);
        this.cmo = false;
        this.ops = false;
        this.channeltemp = true;
        if(event.target.name == 'tracker'){
            this.tracker= true;
        }
    }

    handleMarketing(event){
        if(this.marketing){
            this.marketing = false;
            this.template.querySelector('.marketing').classList.remove('dynamicCSS2');
        }
        else{
            this.marketing = true;
            this.template.querySelector('.marketing').classList.add('dynamicCSS2');
        }
    }

}