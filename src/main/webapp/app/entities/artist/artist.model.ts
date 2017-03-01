import { Track } from '../track';
export class Artist {
    constructor(
        public id?: number,
        public name?: string,
        public track?: Track,
    ) { }
}
