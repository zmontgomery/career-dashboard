import {AfterContentInit, Component, ElementRef, ViewChild} from '@angular/core';
import SwaggerUI from 'swagger-ui';
import api from './api.json'

@Component({
  selector: 'app-api-documentations',
  templateUrl: './api-documentations.component.html',
  styleUrls: ['./api-documentations.component.less']
})
export class ApiDocumentationsComponent implements AfterContentInit {

  @ViewChild('apiElement', {static: true})

  ApiDocElement: ElementRef | undefined

  constructor() { }

  ngAfterContentInit(): void {
    const apiDocumentation = api;

    SwaggerUI({
      spec: apiDocumentation,
      domNode: this.ApiDocElement?.nativeElement,
    })
  }
}
