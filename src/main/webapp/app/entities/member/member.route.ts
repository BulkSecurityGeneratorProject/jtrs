import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { MemberComponent } from './member.component';
import { MemberDetailComponent } from './member-detail.component';
import { MemberPopupComponent } from './member-dialog.component';
import { MemberDeletePopupComponent } from './member-delete-dialog.component';

import { Principal } from '../../shared';


export const memberRoute: Routes = [
  {
    path: 'member',
    component: MemberComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.member.home.title'
    }
  }, {
    path: 'member/:id',
    component: MemberDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.member.home.title'
    }
  }
];

export const memberPopupRoute: Routes = [
  {
    path: 'member-new',
    component: MemberPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.member.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'member/:id/edit',
    component: MemberPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.member.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'member/:id/delete',
    component: MemberDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.member.home.title'
    },
    outlet: 'popup'
  }
];
