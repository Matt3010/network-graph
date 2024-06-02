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

  renderedComponents: ComponentRef<any>[] = [];

  public createComponent(component: any, inputs: any, parentElement: HTMLElement = document.body): ComponentRef<any> {
    // Destroy previously rendered components
    this.renderedComponents.forEach((comp: ComponentRef<any>) => {
      this.destroyComponent(comp);
    });

    // Create component factory
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = componentFactory.create(this.injector);

    // Set component inputs
    Object.assign(componentRef.instance as any, {...inputs, ref: componentRef});

    // Attach component to the Angular component tree
    this.appRef.attachView(componentRef.hostView);

    // Append the component's DOM element to the parent element
    parentElement.appendChild((componentRef.hostView as any).rootNodes[0]);

    // Keep track of the rendered component
    this.renderedComponents.push(componentRef);

    return componentRef;
  }

  public destroyComponent<T>(componentRef: ComponentRef<T>) {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
