import { Entry } from '../entry';
import { Member } from '../member';
export class Playlist {
    constructor(
        public id?: number,
        public number?: string,
        public theme?: any,
        public guest?: any,
        public date?: any,
        public type?: string,
        public recordUrl?: string,
        public createTime?: any,
        public updateTime?: any,
        public entry?: Entry,
        public member?: Member,
    ) { }
}
