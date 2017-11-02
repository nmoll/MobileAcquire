import { Component, OnInit } from '@angular/core';

import { AcquireService } from './acquire.service';

@Component({
    selector: 'acquire',
    templateUrl: 'acquire.component.html'//,
    //styleUrls: [ 'acquire.component.css' ]
})
export class AcquireComponent implements OnInit {

    constructor(private acquireService: AcquireService) {}

    ngOnInit(): void {
        this.acquireService.initGame();
    }

}
