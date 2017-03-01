import { Track } from '../track';
import { Playlist } from '../playlist';
export class Entry {
    constructor(
        public id?: number,
        public position?: number,
        public track?: Track,
        public playlist?: Playlist,
    ) { }
}
