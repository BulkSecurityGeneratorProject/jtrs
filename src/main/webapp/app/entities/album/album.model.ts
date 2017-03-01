import { Label } from '../label';
import { Track } from '../track';
export class Album {
    constructor(
        public id?: number,
        public title?: string,
        public label?: Label,
        public track?: Track,
    ) { }
}
