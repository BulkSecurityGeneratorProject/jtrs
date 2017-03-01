import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils } from 'ng-jhipster';
import { JhiLanguageService } from 'ng-jhipster';
import { MockLanguageService } from '../../../helpers/mock-language.service';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { PlaylistDetailComponent } from '../../../../../../main/webapp/app/entities/playlist/playlist-detail.component';
import { PlaylistService } from '../../../../../../main/webapp/app/entities/playlist/playlist.service';
import { Playlist } from '../../../../../../main/webapp/app/entities/playlist/playlist.model';

describe('Component Tests', () => {

    describe('Playlist Management Detail Component', () => {
        let comp: PlaylistDetailComponent;
        let fixture: ComponentFixture<PlaylistDetailComponent>;
        let service: PlaylistService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [PlaylistDetailComponent],
                providers: [
                    MockBackend,
                    BaseRequestOptions,
                    DateUtils,
                    DataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    {
                        provide: Http,
                        useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backendInstance, defaultOptions);
                        },
                        deps: [MockBackend, BaseRequestOptions]
                    },
                    {
                        provide: JhiLanguageService,
                        useClass: MockLanguageService
                    },
                    PlaylistService
                ]
            }).overrideComponent(PlaylistDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PlaylistDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PlaylistService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Playlist(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.playlist).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
