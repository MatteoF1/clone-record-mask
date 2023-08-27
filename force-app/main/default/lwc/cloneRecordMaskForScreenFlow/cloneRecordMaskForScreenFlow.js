import { LightningElement, api, wire } from 'lwc';
import { createRecord, generateRecordInputForCreate , getRecordCreateDefaults} from 'lightning/uiRecordApi';
import {FlowNavigationNextEvent} from 'lightning/flowSupport';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class CloneRecordMaskForScreenFlow extends LightningElement {

    @api recordId;
    @api objectApiName;
    @api recordTypeId;
    @api newRecordId;

    @wire(getRecordCreateDefaults, { objectApiName: '$objectApiName' , recordTypeId : '$recordTypeId'})
    recordCreateDefaults({error, data}){
        if(data){
            const recordObjectInfo = data.objectInfos[this.objectApiName];
            const recordDefaults = data.record;
            this.recordInput = generateRecordInputForCreate(recordDefaults, recordObjectInfo);
        }
        else{
            console.log('Error fetching defaults: ', JSON.stringify(error));
        }
    };

    handleSubmit(event) {
        event.preventDefault(); 
        const userSelectedFields = event.detail.fields;
        Object.assign(this.recordInput.fields, userSelectedFields);
        createRecord(this.recordInput).then(data => {
            this.dispatchEvent(
                new ShowToastEvent({
                  title: "Success!",
                  message: 'Record created successfully!',
                  variant: "success",
                }),
            );
            console.log(JSON.stringify(data.id));
            this.newRecordId = data.id;
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
        }).catch(error => {
            let errorMessage = error.message;
            try{
                errorMessage = error.body.output.errors[0].message
            }
            catch(errorNoSFinternalError){
                console.log('A generic error happened.');
            }

            this.dispatchEvent(
                new ShowToastEvent({
                  title: "Error!",
                  message: errorMessage,
                  variant: "error",
                }),
            );
        });
    }
}