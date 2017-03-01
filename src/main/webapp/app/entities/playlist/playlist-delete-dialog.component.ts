import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Playlist } from './playlist.model';
import { PlaylistPopupService } from './playlist-popup.service';
import { PlaylistService } from './playlist.service';

@Component({
    selector: 'jhi-playlist-delete-dialog',
    templateUrl: './playlist-delete-dialog.component.html'
})
export class PlaylistDeleteDialogComponent {

    playlist: Playlist;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private playlistService: PlaylistService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['playlist']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.playlistService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'playlistListModification',
                content: 'Deleted an playlist'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-playlist-delete-popup',
    template: ''
})
export class PlaylistDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private playlistPopupService: PlaylistPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.playlistPopupService
                .open(PlaylistDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
