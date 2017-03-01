import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { Artist } from './artist.model';
import { ArtistService } from './artist.service';

@Component({
    selector: 'jhi-artist-detail',
    templateUrl: './artist-detail.component.html'
})
export class ArtistDetailComponent implements OnInit, OnDestroy {

    artist: Artist;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private artistService: ArtistService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['artist']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.artistService.find(id).subscribe(artist => {
            this.artist = artist;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
