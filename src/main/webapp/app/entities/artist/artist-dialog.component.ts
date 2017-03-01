import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Artist } from './artist.model';
import { ArtistPopupService } from './artist-popup.service';
import { ArtistService } from './artist.service';
import { Track, TrackService } from '../track';
@Component({
    selector: 'jhi-artist-dialog',
    templateUrl: './artist-dialog.component.html'
})
export class ArtistDialogComponent implements OnInit {

    artist: Artist;
    authorities: any[];
    isSaving: boolean;

    tracks: Track[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private artistService: ArtistService,
        private trackService: TrackService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['artist']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.trackService.query().subscribe(
            (res: Response) => { this.tracks = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.artist.id !== undefined) {
            this.artistService.update(this.artist)
                .subscribe((res: Artist) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.artistService.create(this.artist)
                .subscribe((res: Artist) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Artist) {
        this.eventManager.broadcast({ name: 'artistListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError (error) {
        this.isSaving = false;
        this.onError(error);
    }

    private onError (error) {
        this.alertService.error(error.message, null, null);
    }

    trackTrackById(index: number, item: Track) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-artist-popup',
    template: ''
})
export class ArtistPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private artistPopupService: ArtistPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.artistPopupService
                    .open(ArtistDialogComponent, params['id']);
            } else {
                this.modalRef = this.artistPopupService
                    .open(ArtistDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
