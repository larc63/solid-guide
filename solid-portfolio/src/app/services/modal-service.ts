import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
    private overlay = inject(Overlay);
    private subscription = new Subscription();

    componentReference:any;
    overlayRef!: OverlayRef;
    open<T>(component: any, data: number[]) {
        this.overlayRef = this.overlay.create({
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: this.overlay
                .position()
                .global()
                .centerHorizontally()
                .centerVertically(),
        });
        
        const portal = new ComponentPortal(component);
        
        const componentRef = this.overlayRef.attach(portal);
        this.overlayRef.backdropClick().subscribe(() => this.overlayRef.detach());
        
        this.componentReference = <typeof component>(componentRef.instance);
        this.componentReference.sIndex.set(data[0]);
        this.componentReference.tIndex.set(data[1]);
        this.componentReference.parentRef = this.overlayRef;

        this.subscription.add(
            this.overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
                switch (event.key) {
                    case 'Escape':
                        this.overlayRef.dispose();
                        break;
                    case 'ArrowLeft':
                        this.componentReference.goLeft();
                        break;
                    case 'ArrowRight':
                        this.componentReference.goRight();
                        break;
                }
            }),
        );
    }
}
