import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { Album } from './album.model';
import { AlbumService } from './album.service';

@Component({
    selector: 'jhi-album-detail',
    templateUrl: './album-detail.component.html'
})
export class AlbumDetailComponent implements OnInit, OnDestroy {

    album: Album;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private albumService: AlbumService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['album']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.albumService.find(id).subscribe(album => {
            this.album = album;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
