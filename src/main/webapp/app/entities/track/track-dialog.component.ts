import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Track } from './track.model';
import { TrackPopupService } from './track-popup.service';
import { TrackService } from './track.service';
import { Artist, ArtistService } from '../artist';
import { Entry, EntryService } from '../entry';
import { Album, AlbumService } from '../album';
@Component({
    selector: 'jhi-track-dialog',
    templateUrl: './track-dialog.component.html'
})
export class TrackDialogComponent implements OnInit {

    track: Track;
    authorities: any[];
    isSaving: boolean;

    artists: Artist[];

    entries: Entry[];

    albums: Album[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private trackService: TrackService,
        private artistService: ArtistService,
        private entryService: EntryService,
        private albumService: AlbumService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['track']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.artistService.query().subscribe(
            (res: Response) => { this.artists = res.json(); }, (res: Response) => this.onError(res.json()));
        this.entryService.query().subscribe(
            (res: Response) => { this.entries = res.json(); }, (res: Response) => this.onError(res.json()));
        this.albumService.query().subscribe(
            (res: Response) => { this.albums = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.track.id !== undefined) {
            this.trackService.update(this.track)
                .subscribe((res: Track) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.trackService.create(this.track)
                .subscribe((res: Track) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Track) {
        this.eventManager.broadcast({ name: 'trackListModification', content: 'OK'});
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

    trackArtistById(index: number, item: Artist) {
        return item.id;
    }

    trackEntryById(index: number, item: Entry) {
        return item.id;
    }

    trackAlbumById(index: number, item: Album) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-track-popup',
    template: ''
})
export class TrackPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private trackPopupService: TrackPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.trackPopupService
                    .open(TrackDialogComponent, params['id']);
            } else {
                this.modalRef = this.trackPopupService
                    .open(TrackDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
