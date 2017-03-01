import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Member } from './member.model';
import { MemberPopupService } from './member-popup.service';
import { MemberService } from './member.service';

@Component({
    selector: 'jhi-member-delete-dialog',
    templateUrl: './member-delete-dialog.component.html'
})
export class MemberDeleteDialogComponent {

    member: Member;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private memberService: MemberService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['member']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.memberService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'memberListModification',
                content: 'Deleted an member'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-member-delete-popup',
    template: ''
})
export class MemberDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private memberPopupService: MemberPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.memberPopupService
                .open(MemberDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
