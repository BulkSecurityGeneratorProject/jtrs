import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { Member } from './member.model';
import { MemberService } from './member.service';

@Component({
    selector: 'jhi-member-detail',
    templateUrl: './member-detail.component.html'
})
export class MemberDetailComponent implements OnInit, OnDestroy {

    member: Member;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private memberService: MemberService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['member']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.memberService.find(id).subscribe(member => {
            this.member = member;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
