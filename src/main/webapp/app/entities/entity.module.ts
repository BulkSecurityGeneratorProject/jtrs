import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { JtrsAlbumModule } from './album/album.module';
import { JtrsArtistModule } from './artist/artist.module';
import { JtrsEntryModule } from './entry/entry.module';
import { JtrsLabelModule } from './label/label.module';
import { JtrsMemberModule } from './member/member.module';
import { JtrsPlaylistModule } from './playlist/playlist.module';
import { JtrsTrackModule } from './track/track.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        JtrsAlbumModule,
        JtrsArtistModule,
        JtrsEntryModule,
        JtrsLabelModule,
        JtrsMemberModule,
        JtrsPlaylistModule,
        JtrsTrackModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JtrsEntityModule {}
