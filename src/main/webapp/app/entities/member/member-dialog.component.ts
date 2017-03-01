import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Member } from './member.model';
import { MemberPopupService } from './member-popup.service';
import { MemberService } from './member.service';
import { Playlist, PlaylistService } from '../playlist';
@Component({
    selector: 'jhi-member-dialog',
    templateUrl: './member-dialog.component.html'
})
export class MemberDialogComponent implements OnInit {

    member: Member;
    authorities: any[];
    isSaving: boolean;

    playlists: Playlist[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private memberService: MemberService,
        private playlistService: PlaylistService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['member']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.playlistService.query().subscribe(
            (res: Response) => { this.playlists = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.member.id !== undefined) {
            this.memberService.update(this.member)
                .subscribe((res: Member) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.memberService.create(this.member)
                .subscribe((res: Member) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Member) {
        this.eventManager.broadcast({ name: 'memberListModification', content: 'OK'});
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

    trackPlaylistById(index: number, item: Playlist) {
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
    selector: 'jhi-member-popup',
    template: ''
})
export class MemberPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private memberPopupService: MemberPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.memberPopupService
                    .open(MemberDialogComponent, params['id']);
            } else {
                this.modalRef = this.memberPopupService
                    .open(MemberDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
