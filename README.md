# Clone Record Mask for Screen Flows

Small Salesforce LWC which provides a generic, low-maintenance record mask which 
can be used in Screen Flows and allows to clone records while being in the context of a flow interview.

N.B. this is a demo only. Not to be used for production.

## Open Tasks

- Add video?
- With reference also to technical notes, the js file requires refactoring because it is possible there is a better idea to dynamically load fields from the layout of the object we want to create and at the same time retrieve field values of the object we want to clone.

## Technical Requirements

The LWC shall:
1. leverage standard record layouts, in order to minimize maintenance;
2. accept a record Id and a record type Id, in order to display the appropriate layout with pre-filled fields;
3. allow the user to edit fields before saving;
4. display success/error messages.
5. return the new record Id flow interview in order for it to proceed.

## Technical notes

The component [lightning-record-form](https://developer.salesforce.com/docs/component-library/bundle/lightning-record-form/documentation) would be the best, but as of 27.08.2023, the attributes record-id and record-type-id do not work together, e.g. to change the record type. Instead record-id takes precedence and the layout is loaded for the existing record type, so if you have a different layout for another record type, that will be hidden.

The component [lightning-record-edit-form](https://developer.salesforce.com/docs/component-library/bundle/lightning-record-edit-form/documentation) requires much more effort, because it does not load the layout automatically. Instead the layout fields must be parsed using another API call. This component allows nevertheless to complete the job once the layout is parsed correctly.

## Other Documentation and Examples

In the folder "examples" a screen flow used as example is presented.

1. The first layout displays field "Field for sales process 1":
![Opportunity Layout 1](/examples/test-flow-clone--opportunity/screenshots/2_setup_opp_layout_2.png)
2. The second layout displays field "Field for sales process 2":
![Opportunity Layout 2](/examples/test-flow-clone--opportunity/screenshots/1_setup_opp_layout_1.png)
3. Two record types exist:
![Record Types](/examples/test-flow-clone--opportunity/screenshots/3_setup_opp_record_types.png)
4. Page layout assignment is appropriate for the correct layout:
![Page layout assignments](/examples/test-flow-clone--opportunity/screenshots/30_page_layout_assignment.png)
5. A screen flow exists and calls the LWC in the "Clone Record" screen: (N.B. the only reference to the SObject here is in the record type! It can be made completely generic.)
![Clone record flow](/examples/test-flow-clone--opportunity/screenshots/4_flow.png)
6. A quick action allows to put the flow on the Opp page layout:
![Quick Action](/examples/test-flow-clone--opportunity/screenshots/5_create_action.png)
7. One opportunity for Record Type 1 (See field "Field for sales process 1" on the layout) exists:
![Opportunity 1](/examples/test-flow-clone--opportunity/screenshots/7_new_opportunity.png)
8. User clicks on the action:
![Click on action](/examples/test-flow-clone--opportunity/screenshots/8_click_page_layout_action.png)
9. User can select new record type for the clone:
![New record type selection](/examples/test-flow-clone--opportunity/screenshots/9_select_record_type_new_oppty.png)
10. The LWC displays all
    - creatable fields on the layout corresponding to the combination of user profile and selected record type ("Record Type 2" in the screenshots);
    - field values extracted from "Opportunity 1", as long as they are on the layout for "Record Type 2" and are creatable by the user;
![Set fields](/examples/test-flow-clone--opportunity/screenshots/90_set_field_on_page_layout_2.png)
11. After creation, the new record has the appropriate record type, as visible from field "Field for sales process 2" on the layout:
![New record](/examples/test-flow-clone--opportunity/screenshots/91_creation_returns_record_type_2.png)



