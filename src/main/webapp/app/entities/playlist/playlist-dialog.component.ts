import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService, DataUtils } from 'ng-jhipster';

import { Playlist } from './playlist.model';
import { PlaylistPopupService } from './playlist-popup.service';
import { PlaylistService } from './playlist.service';
import { Entry, EntryService } from '../entry';
import { Member, MemberService } from '../member';
@Component({
    selector: 'jhi-playlist-dialog',
    templateUrl: './playlist-dialog.component.html'
})
export class PlaylistDialogComponent implements OnInit {

    playlist: Playlist;
    authorities: any[];
    isSaving: boolean;

    entries: Entry[];

    members: Member[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: DataUtils,
        private alertService: AlertService,
        private playlistService: PlaylistService,
        private entryService: EntryService,
        private memberService: MemberService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['playlist']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.entryService.query().subscribe(
            (res: Response) => { this.entries = res.json(); }, (res: Response) => this.onError(res.json()));
        this.memberService.query().subscribe(
            (res: Response) => { this.members = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData($event, playlist, field, isImage) {
        if ($event.target.files && $event.target.files[0]) {
            let $file = $event.target.files[0];
            if (isImage && !/^image\//.test($file.type)) {
                return;
            }
            this.dataUtils.toBase64($file, (base64Data) => {
                playlist[field] = base64Data;
                playlist[`${field}ContentType`] = $file.type;
            });
        }
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.playlist.id !== undefined) {
            this.playlistService.update(this.playlist)
                .subscribe((res: Playlist) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.playlistService.create(this.playlist)
                .subscribe((res: Playlist) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Playlist) {
        this.eventManager.broadcast({ name: 'playlistListModification', content: 'OK'});
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

    trackEntryById(index: number, item: Entry) {
        return item.id;
    }

    trackMemberById(index: number, item: Member) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-playlist-popup',
    template: ''
})
export class PlaylistPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private playlistPopupService: PlaylistPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.playlistPopupService
                    .open(PlaylistDialogComponent, params['id']);
            } else {
                this.modalRef = this.playlistPopupService
                    .open(PlaylistDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
