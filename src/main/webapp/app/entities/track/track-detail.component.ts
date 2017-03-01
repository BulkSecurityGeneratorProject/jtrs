import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { Track } from './track.model';
import { TrackService } from './track.service';

@Component({
    selector: 'jhi-track-detail',
    templateUrl: './track-detail.component.html'
})
export class TrackDetailComponent implements OnInit, OnDestroy {

    track: Track;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private trackService: TrackService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['track']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.trackService.find(id).subscribe(track => {
            this.track = track;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
