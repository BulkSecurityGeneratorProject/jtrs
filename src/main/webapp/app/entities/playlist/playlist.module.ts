import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JtrsSharedModule } from '../../shared';

import {
    PlaylistService,
    PlaylistPopupService,
    PlaylistComponent,
    PlaylistDetailComponent,
    PlaylistDialogComponent,
    PlaylistPopupComponent,
    PlaylistDeletePopupComponent,
    PlaylistDeleteDialogComponent,
    playlistRoute,
    playlistPopupRoute,
} from './';

let ENTITY_STATES = [
    ...playlistRoute,
    ...playlistPopupRoute,
];

@NgModule({
    imports: [
        JtrsSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        PlaylistComponent,
        PlaylistDetailComponent,
        PlaylistDialogComponent,
        PlaylistDeleteDialogComponent,
        PlaylistPopupComponent,
        PlaylistDeletePopupComponent,
    ],
    entryComponents: [
        PlaylistComponent,
        PlaylistDialogComponent,
        PlaylistPopupComponent,
        PlaylistDeleteDialogComponent,
        PlaylistDeletePopupComponent,
    ],
    providers: [
        PlaylistService,
        PlaylistPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JtrsPlaylistModule {}
