import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { AlbumComponent } from './album.component';
import { AlbumDetailComponent } from './album-detail.component';
import { AlbumPopupComponent } from './album-dialog.component';
import { AlbumDeletePopupComponent } from './album-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class AlbumResolvePagingParams implements Resolve<any> {

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

export const albumRoute: Routes = [
  {
    path: 'album',
    component: AlbumComponent,
    resolve: {
      'pagingParams': AlbumResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.album.home.title'
    }
  }, {
    path: 'album/:id',
    component: AlbumDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.album.home.title'
    }
  }
];

export const albumPopupRoute: Routes = [
  {
    path: 'album-new',
    component: AlbumPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.album.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'album/:id/edit',
    component: AlbumPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.album.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'album/:id/delete',
    component: AlbumDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.album.home.title'
    },
    outlet: 'popup'
  }
];
