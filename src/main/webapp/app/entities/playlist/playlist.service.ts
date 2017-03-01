import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Playlist } from './playlist.model';
import { DateUtils } from 'ng-jhipster';
@Injectable()
export class PlaylistService {

    private resourceUrl = 'api/playlists';
    private resourceSearchUrl = 'api/_search/playlists';

    constructor(private http: Http, private dateUtils: DateUtils) { }

    create(playlist: Playlist): Observable<Playlist> {
        let copy: Playlist = Object.assign({}, playlist);
        copy.date = this.dateUtils
            .convertLocalDateToServer(playlist.date);
        copy.createTime = this.dateUtils.toDate(playlist.createTime);
        copy.updateTime = this.dateUtils.toDate(playlist.updateTime);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(playlist: Playlist): Observable<Playlist> {
        let copy: Playlist = Object.assign({}, playlist);
        copy.date = this.dateUtils
            .convertLocalDateToServer(playlist.date);

        copy.createTime = this.dateUtils.toDate(playlist.createTime);

        copy.updateTime = this.dateUtils.toDate(playlist.updateTime);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Playlist> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            let jsonResponse = res.json();
            jsonResponse.date = this.dateUtils
                .convertLocalDateFromServer(jsonResponse.date);
            jsonResponse.createTime = this.dateUtils
                .convertDateTimeFromServer(jsonResponse.createTime);
            jsonResponse.updateTime = this.dateUtils
                .convertDateTimeFromServer(jsonResponse.updateTime);
            return jsonResponse;
        });
    }

    query(req?: any): Observable<Response> {
        let options = this.createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: any) => this.convertResponse(res))
        ;
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<Response> {
        let options = this.createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res))
        ;
    }

    private convertResponse(res: any): any {
        let jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            jsonResponse[i].date = this.dateUtils
                .convertLocalDateFromServer(jsonResponse[i].date);
            jsonResponse[i].createTime = this.dateUtils
                .convertDateTimeFromServer(jsonResponse[i].createTime);
            jsonResponse[i].updateTime = this.dateUtils
                .convertDateTimeFromServer(jsonResponse[i].updateTime);
        }
        res._body = jsonResponse;
        return res;
    }

    private createRequestOption(req?: any): BaseRequestOptions {
        let options: BaseRequestOptions = new BaseRequestOptions();
        if (req) {
            let params: URLSearchParams = new URLSearchParams();
            params.set('page', req.page);
            params.set('size', req.size);
            if (req.sort) {
                params.paramsMap.set('sort', req.sort);
            }
            params.set('query', req.query);

            options.search = params;
        }
        return options;
    }
}
