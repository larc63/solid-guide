import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
    private overlay = inject(Overlay);
    private subscription = new Subscription();
    open<T>(component: any, data: number[]) {
        const overlayRef = this.overlay.create({
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: this.overlay
                .position()
                .global()
                .centerHorizontally()
                .centerVertically(),
        });
        this.subscription.add(
            overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    overlayRef.dispose();
                }
            }),
        );
        const portal = new ComponentPortal(component);
        const componentRef = overlayRef.attach(portal);
        overlayRef.backdropClick().subscribe(() => overlayRef.detach());
        const r = <typeof component>(componentRef.instance);
        r.idx = data;
    }
}
