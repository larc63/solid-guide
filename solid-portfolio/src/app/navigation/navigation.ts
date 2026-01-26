import { Component, OutputEmitterRef, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faCaretSquareLeft,
    faCaretSquareRight,
    faCaretSquareDown,
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-navigation',
    imports: [FontAwesomeModule],
    templateUrl: './navigation.html',
    styleUrl: './navigation.scss',
})
export class Navigation {
    faCaretSquareLeft = faCaretSquareLeft;
    faCaretSquareRight = faCaretSquareRight;
    faCaretSquareDown = faCaretSquareDown;

    clickEvent: OutputEmitterRef<string> = output<string>();

    handleClick(id: string): void {
       this.clickEvent.emit(id);
    }
}
