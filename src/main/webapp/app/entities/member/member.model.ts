import { Playlist } from '../playlist';
export class Member {
    constructor(
        public id?: number,
        public name?: string,
        public status?: string,
        public playlist?: Playlist,
    ) { }
}
