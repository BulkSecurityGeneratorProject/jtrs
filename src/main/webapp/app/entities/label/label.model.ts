import { Album } from '../album';
export class Label {
    constructor(
        public id?: number,
        public name?: string,
        public release?: Album,
    ) { }
}
