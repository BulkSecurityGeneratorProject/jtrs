import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { TrackComponent } from './track.component';
import { TrackDetailComponent } from './track-detail.component';
import { TrackPopupComponent } from './track-dialog.component';
import { TrackDeletePopupComponent } from './track-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class TrackResolvePagingParams implements Resolve<any> {

  constructor(private paginationUtil: PaginationUtil) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      let page = route.queryParams['page'] ? route.queryParams['page'] : '1';
      let sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
      return {
          page: this.paginationUtil.parsePage(page),
          predicate: this.paginationUtil.parsePredicate(sort),
          ascending: this.paginationUtil.parseAscending(sort)
    };
  }
}

export const trackRoute: Routes = [
  {
    path: 'track',
    component: TrackComponent,
    resolve: {
      'pagingParams': TrackResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.track.home.title'
    }
  }, {
    path: 'track/:id',
    component: TrackDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.track.home.title'
    }
  }
];

export const trackPopupRoute: Routes = [
  {
    path: 'track-new',
    component: TrackPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.track.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'track/:id/edit',
    component: TrackPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.track.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'track/:id/delete',
    component: TrackDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.track.home.title'
    },
    outlet: 'popup'
  }
];
