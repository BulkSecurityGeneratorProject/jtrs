import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { PlaylistComponent } from './playlist.component';
import { PlaylistDetailComponent } from './playlist-detail.component';
import { PlaylistPopupComponent } from './playlist-dialog.component';
import { PlaylistDeletePopupComponent } from './playlist-delete-dialog.component';

import { Principal } from '../../shared';


export const playlistRoute: Routes = [
  {
    path: 'playlist',
    component: PlaylistComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.playlist.home.title'
    }
  }, {
    path: 'playlist/:id',
    component: PlaylistDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.playlist.home.title'
    }
  }
];

export const playlistPopupRoute: Routes = [
  {
    path: 'playlist-new',
    component: PlaylistPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.playlist.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'playlist/:id/edit',
    component: PlaylistPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.playlist.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'playlist/:id/delete',
    component: PlaylistDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'jtrsApp.playlist.home.title'
    },
    outlet: 'popup'
  }
];
