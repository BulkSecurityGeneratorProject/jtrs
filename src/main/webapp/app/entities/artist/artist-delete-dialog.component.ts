import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Artist } from './artist.model';
import { ArtistPopupService } from './artist-popup.service';
import { ArtistService } from './artist.service';

@Component({
    selector: 'jhi-artist-delete-dialog',
    templateUrl: './artist-delete-dialog.component.html'
})
export class ArtistDeleteDialogComponent {

    artist: Artist;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private artistService: ArtistService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['artist']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.artistService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'artistListModification',
                content: 'Deleted an artist'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-artist-delete-popup',
    template: ''
})
export class ArtistDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private artistPopupService: ArtistPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.artistPopupService
                .open(ArtistDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
