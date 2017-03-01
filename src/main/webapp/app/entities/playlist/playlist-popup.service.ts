import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Playlist } from './playlist.model';
import { PlaylistService } from './playlist.service';
@Injectable()
export class PlaylistPopupService {
    private isOpen = false;
    constructor (
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private playlistService: PlaylistService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.playlistService.find(id).subscribe(playlist => {
                if (playlist.date) {
                    playlist.date = {
                        year: playlist.date.getFullYear(),
                        month: playlist.date.getMonth() + 1,
                        day: playlist.date.getDate()
                    };
                }
                playlist.createTime = this.datePipe.transform(playlist.createTime, 'yyyy-MM-ddThh:mm');
                playlist.updateTime = this.datePipe.transform(playlist.updateTime, 'yyyy-MM-ddThh:mm');
                this.playlistModalRef(component, playlist);
            });
        } else {
            return this.playlistModalRef(component, new Playlist());
        }
    }

    playlistModalRef(component: Component, playlist: Playlist): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.playlist = playlist;
        modalRef.result.then(result => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
