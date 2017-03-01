import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Album } from './album.model';
import { AlbumPopupService } from './album-popup.service';
import { AlbumService } from './album.service';

@Component({
    selector: 'jhi-album-delete-dialog',
    templateUrl: './album-delete-dialog.component.html'
})
export class AlbumDeleteDialogComponent {

    album: Album;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private albumService: AlbumService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['album']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.albumService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'albumListModification',
                content: 'Deleted an album'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-album-delete-popup',
    template: ''
})
export class AlbumDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private albumPopupService: AlbumPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.albumPopupService
                .open(AlbumDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
