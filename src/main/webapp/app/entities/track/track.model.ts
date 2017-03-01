import { Artist } from '../artist';
import { Entry } from '../entry';
import { Album } from '../album';
export class Track {
    constructor(
        public id?: number,
        public title?: string,
        public artist?: Artist,
        public entry?: Entry,
        public album?: Album,
    ) { }
}
