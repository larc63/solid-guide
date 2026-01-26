import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faIdBadge } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-footer',
    imports: [FontAwesomeModule],
    templateUrl: './footer.html',
    styleUrl: './footer.scss',
})
export class Footer {
faIcon = faIdBadge;

}
