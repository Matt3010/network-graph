import {Component, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {ComponentInjectorService} from "../../../../services/utils/component-injector.service";
import {ModalTemplateAbstract} from "../modal.template.abstract";

@Component({
  selector: 'app-md-sm',
  templateUrl: './md-sm.component.html',
  styleUrls: ['./md-sm.component.scss']
})
export class MdSmComponent extends ModalTemplateAbstract {

  @Input() component!: any;
  @Input() title: string | null = null;
  @Input() ref!: any;
  @ViewChild('componentView', {read: ViewContainerRef, static: true}) componentView!: ViewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injectorService: ComponentInjectorService
  ) {
    super();
  }

  ngOnInit(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
    this.componentView.clear();
    this.componentView.createComponent(componentFactory);
  }

  close() {
    this.injectorService.destroyComponent()
  }

}
