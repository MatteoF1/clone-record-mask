import { LightningElement, api, wire, track } from 'lwc';
import { getRecord , getRecordCreateDefaults} from 'lightning/uiRecordApi';
import { FlowNavigationBackEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class CloneRecordMaskForScreenFlow extends LightningElement {

    @api recordId;
    @api objectApiName;
    @api recordTypeId;
    @api newRecordId;

    @track layoutSections;

    @wire(getRecordCreateDefaults, { objectApiName: '$objectApiName' , recordTypeId : '$recordTypeId'})
    retrieveObjectInfoForNewRecord({error, data}){
        if(data){
            this._defaultFieldsFromRecordType = data.record.fields;
            this._layoutSections = data.layout.sections;
            this._prepareDefaultsAndLayoutSectionsForDisplay();
        }
        else if(error){
            console.log('Error fetching defaults: ', JSON.stringify(error));
        }
    };

    @wire(getRecord, {recordId: '$recordId', layoutTypes: 'Full'})
    retrieveExistingRecordData({error, data}){
        if(data){
            this._defaultFieldsFromExistingRecord = data.fields;
            this._prepareDefaultsAndLayoutSectionsForDisplay();
        }
        else if(error){
            console.log('Error fetching defaults: ', JSON.stringify(error));
        }
    };

    handleSuccess(event){
        this.dispatchEvent(
            new ShowToastEvent({
              title: "Success!",
              message: 'Record created successfully!',
              variant: "success",
            }),
        );
        this.newRecordId = event.detail.id;
        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
    }

    handleError(event){
        console.log(JSON.stringify(event));
        this.dispatchEvent(
            new ShowToastEvent({
              title: "Error!",
              message: errorMessage,
              variant: "error",
            }),
        );
    }

    handleCancel(event) {
        event.preventDefault(); 
        const navigateBackEvent = new FlowNavigationBackEvent();
        this.dispatchEvent(navigateBackEvent);
    }

    _prepareDefaultsAndLayoutSectionsForDisplay(){
        if(this._defaultFieldsFromRecordType && this._defaultFieldsFromExistingRecord && this._layoutSections){
            const defaultFields = Object.assign({selected: false}, this._defaultFieldsFromRecordType, this._defaultFieldsFromExistingRecord);
            this.layoutSections = this._prepareLayoutSectionsForDisplay(this._layoutSections, defaultFields);
        }
    }

    /* this requires refactoring in e.g. the data structures because it can be improved
    *  As is, it keeps the output of the "getRecordCreateDefaults" method and adds the
    *  missing unique keys necessary in the HTML to use the template tags. In addition,
    *  it fills the value component on the field.
    */
    _prepareLayoutSectionsForDisplay(sections, defaultFields){
        const layoutSections = sections.map((section, indexSection) => { 
            const newSection= Object.assign({selected: false}, section);
            newSection['layoutRows'] = section.layoutRows.map(
                (row, indexRow) => {
                    const newRow = Object.assign({selected: false}, row);
                    newRow['rowKey'] = indexSection + '-' + indexRow;
                    newRow.layoutItems = row.layoutItems.map((item, indexItem) => {
                        const newItem = Object.assign({selected: false}, item);
                        newItem['itemKey'] = indexSection + '-' + indexRow + '-' + indexItem;
                        const newLayoutComponent = Object.assign({selected: false}, item.layoutComponents[0]);
                        if(newLayoutComponent && newLayoutComponent.apiName){
                            newLayoutComponent.value = defaultFields[newLayoutComponent.apiName].value;
                        }
                        newItem['layoutComponents'] = [newLayoutComponent];
                        return newItem;
                    });
                    return newRow;
            });
            return newSection;
        });
        return layoutSections;
    }
}