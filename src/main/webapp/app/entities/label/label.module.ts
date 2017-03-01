import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JtrsSharedModule } from '../../shared';

import {
    LabelService,
    LabelPopupService,
    LabelComponent,
    LabelDetailComponent,
    LabelDialogComponent,
    LabelPopupComponent,
    LabelDeletePopupComponent,
    LabelDeleteDialogComponent,
    labelRoute,
    labelPopupRoute,
} from './';

let ENTITY_STATES = [
    ...labelRoute,
    ...labelPopupRoute,
];

@NgModule({
    imports: [
        JtrsSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        LabelComponent,
        LabelDetailComponent,
        LabelDialogComponent,
        LabelDeleteDialogComponent,
        LabelPopupComponent,
        LabelDeletePopupComponent,
    ],
    entryComponents: [
        LabelComponent,
        LabelDialogComponent,
        LabelPopupComponent,
        LabelDeleteDialogComponent,
        LabelDeletePopupComponent,
    ],
    providers: [
        LabelService,
        LabelPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JtrsLabelModule {}
