import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JtrsSharedModule } from '../../shared';

import {
    ArtistService,
    ArtistPopupService,
    ArtistComponent,
    ArtistDetailComponent,
    ArtistDialogComponent,
    ArtistPopupComponent,
    ArtistDeletePopupComponent,
    ArtistDeleteDialogComponent,
    artistRoute,
    artistPopupRoute,
} from './';

let ENTITY_STATES = [
    ...artistRoute,
    ...artistPopupRoute,
];

@NgModule({
    imports: [
        JtrsSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        ArtistComponent,
        ArtistDetailComponent,
        ArtistDialogComponent,
        ArtistDeleteDialogComponent,
        ArtistPopupComponent,
        ArtistDeletePopupComponent,
    ],
    entryComponents: [
        ArtistComponent,
        ArtistDialogComponent,
        ArtistPopupComponent,
        ArtistDeleteDialogComponent,
        ArtistDeletePopupComponent,
    ],
    providers: [
        ArtistService,
        ArtistPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JtrsArtistModule {}
