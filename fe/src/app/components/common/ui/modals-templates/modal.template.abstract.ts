import {ComponentFactoryResolver, Injectable, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {ComponentInjectorService} from "../../../../../services/utils/component-injector.service";

@Injectable()
export abstract class ModalTemplateAbstract {
  @Input() abstract component: any;
  @Input() abstract ref: any;

  // @ts-ignore
  @ViewChild('componentView', {read: ViewContainerRef, static: true}) abstract componentView: ViewContainerRef;

  abstract ngOnInit(): void;
  abstract close(): void;
}
