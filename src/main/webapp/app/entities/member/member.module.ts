import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JtrsSharedModule } from '../../shared';

import {
    MemberService,
    MemberPopupService,
    MemberComponent,
    MemberDetailComponent,
    MemberDialogComponent,
    MemberPopupComponent,
    MemberDeletePopupComponent,
    MemberDeleteDialogComponent,
    memberRoute,
    memberPopupRoute,
} from './';

let ENTITY_STATES = [
    ...memberRoute,
    ...memberPopupRoute,
];

@NgModule({
    imports: [
        JtrsSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        MemberComponent,
        MemberDetailComponent,
        MemberDialogComponent,
        MemberDeleteDialogComponent,
        MemberPopupComponent,
        MemberDeletePopupComponent,
    ],
    entryComponents: [
        MemberComponent,
        MemberDialogComponent,
        MemberPopupComponent,
        MemberDeleteDialogComponent,
        MemberDeletePopupComponent,
    ],
    providers: [
        MemberService,
        MemberPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JtrsMemberModule {}
