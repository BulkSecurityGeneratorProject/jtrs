import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService, DataUtils } from 'ng-jhipster';
import { Playlist } from './playlist.model';
import { PlaylistService } from './playlist.service';

@Component({
    selector: 'jhi-playlist-detail',
    templateUrl: './playlist-detail.component.html'
})
export class PlaylistDetailComponent implements OnInit, OnDestroy {

    playlist: Playlist;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: DataUtils,
        private playlistService: PlaylistService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['playlist']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.playlistService.find(id).subscribe(playlist => {
            this.playlist = playlist;
        });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
