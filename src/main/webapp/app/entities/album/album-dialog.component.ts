import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Album } from './album.model';
import { AlbumPopupService } from './album-popup.service';
import { AlbumService } from './album.service';
import { Label, LabelService } from '../label';
import { Track, TrackService } from '../track';
@Component({
    selector: 'jhi-album-dialog',
    templateUrl: './album-dialog.component.html'
})
export class AlbumDialogComponent implements OnInit {

    album: Album;
    authorities: any[];
    isSaving: boolean;

    labels: Label[];

    tracks: Track[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private albumService: AlbumService,
        private labelService: LabelService,
        private trackService: TrackService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['album']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.labelService.query().subscribe(
            (res: Response) => { this.labels = res.json(); }, (res: Response) => this.onError(res.json()));
        this.trackService.query().subscribe(
            (res: Response) => { this.tracks = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.album.id !== undefined) {
            this.albumService.update(this.album)
                .subscribe((res: Album) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.albumService.create(this.album)
                .subscribe((res: Album) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Album) {
        this.eventManager.broadcast({ name: 'albumListModification', content: 'OK'});
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

    trackLabelById(index: number, item: Label) {
        return item.id;
    }

    trackTrackById(index: number, item: Track) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-album-popup',
    template: ''
})
export class AlbumPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private albumPopupService: AlbumPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.albumPopupService
                    .open(AlbumDialogComponent, params['id']);
            } else {
                this.modalRef = this.albumPopupService
                    .open(AlbumDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
