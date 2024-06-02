import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, ComponentRef, Type } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentInjectorService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}


  currentActive: ComponentRef<any> | null = null;

  public createComponent(component: any, inputs: any, parentElement: HTMLElement = document.body): void {

    // Create component factory
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = componentFactory.create(this.injector);

    // Set component inputs
    Object.assign(componentRef.instance as any, {...inputs, ref: componentRef});

    // Attach component to the Angular component tree
    this.appRef.attachView(componentRef.hostView);

    if(this.currentActive) {
      this.destroyComponent()
    }

    this.currentActive = componentRef;

    // Append the component's DOM element to the parent element
    parentElement.appendChild((componentRef.hostView as any).rootNodes[0]);
  }

  public destroyComponent() {
    if(this.currentActive) {
      this.appRef.detachView(this.currentActive.hostView);
      this.currentActive.destroy();
    }
  }
}
