import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JtrsSharedModule } from '../../shared';

import {
    TrackService,
    TrackPopupService,
    TrackComponent,
    TrackDetailComponent,
    TrackDialogComponent,
    TrackPopupComponent,
    TrackDeletePopupComponent,
    TrackDeleteDialogComponent,
    trackRoute,
    trackPopupRoute,
} from './';

let ENTITY_STATES = [
    ...trackRoute,
    ...trackPopupRoute,
];

@NgModule({
    imports: [
        JtrsSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        TrackComponent,
        TrackDetailComponent,
        TrackDialogComponent,
        TrackDeleteDialogComponent,
        TrackPopupComponent,
        TrackDeletePopupComponent,
    ],
    entryComponents: [
        TrackComponent,
        TrackDialogComponent,
        TrackPopupComponent,
        TrackDeleteDialogComponent,
        TrackDeletePopupComponent,
    ],
    providers: [
        TrackService,
        TrackPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JtrsTrackModule {}
