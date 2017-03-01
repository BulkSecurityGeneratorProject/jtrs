import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Entry } from './entry.model';
import { EntryPopupService } from './entry-popup.service';
import { EntryService } from './entry.service';
import { Track, TrackService } from '../track';
import { Playlist, PlaylistService } from '../playlist';
@Component({
    selector: 'jhi-entry-dialog',
    templateUrl: './entry-dialog.component.html'
})
export class EntryDialogComponent implements OnInit {

    entry: Entry;
    authorities: any[];
    isSaving: boolean;

    tracks: Track[];

    playlists: Playlist[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private entryService: EntryService,
        private trackService: TrackService,
        private playlistService: PlaylistService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['entry']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.trackService.query().subscribe(
            (res: Response) => { this.tracks = res.json(); }, (res: Response) => this.onError(res.json()));
        this.playlistService.query().subscribe(
            (res: Response) => { this.playlists = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.entry.id !== undefined) {
            this.entryService.update(this.entry)
                .subscribe((res: Entry) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.entryService.create(this.entry)
                .subscribe((res: Entry) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Entry) {
        this.eventManager.broadcast({ name: 'entryListModification', content: 'OK'});
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

    trackPlaylistById(index: number, item: Playlist) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-entry-popup',
    template: ''
})
export class EntryPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private entryPopupService: EntryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.entryPopupService
                    .open(EntryDialogComponent, params['id']);
            } else {
                this.modalRef = this.entryPopupService
                    .open(EntryDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
