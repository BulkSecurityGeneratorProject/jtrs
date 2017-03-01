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
import { TrackDetailComponent } from '../../../../../../main/webapp/app/entities/track/track-detail.component';
import { TrackService } from '../../../../../../main/webapp/app/entities/track/track.service';
import { Track } from '../../../../../../main/webapp/app/entities/track/track.model';

describe('Component Tests', () => {

    describe('Track Management Detail Component', () => {
        let comp: TrackDetailComponent;
        let fixture: ComponentFixture<TrackDetailComponent>;
        let service: TrackService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [TrackDetailComponent],
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
                    TrackService
                ]
            }).overrideComponent(TrackDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TrackDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TrackService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Track(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.track).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
