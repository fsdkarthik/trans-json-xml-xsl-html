import { Component, OnInit, VERSION } from '@angular/core';
import { RenderService } from './render.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Using XSLT & XML!';
  report = 'no report';
  transformation = 'T1';

  constructor(private renderService: RenderService) {}

  ngOnInit() {
    this.loadReportData();
  }

  async loadReportData() {
    const xmlDocument = await this.renderService.transformJsonToDocument(
      'https://raw.githubusercontent.com/fsdkarthik/xsl-tranform-data/main/db-list.json'
    );
    const xslUri = `https://raw.githubusercontent.com/fsdkarthik/xsl-tranform-data/main/formats/${
      this.transformation === 'T1' ? 'trans1' : 'trans2'
    }.xsl`;
    const htmlResponse = await this.renderService.transformXmlWithXsl(
      xmlDocument,
      xslUri
    );
    const htmlDocument = this.extractBodyFromHtml(htmlResponse).innerHTML;
    console.log(htmlDocument);
    this.report = htmlDocument;
  }

  changeTransform() {
    this.loadReportData();
  }

  extractBodyFromHtml(htmlDoc: Document): HTMLBodyElement {
    return htmlDoc.querySelector('body')!;
  }
}
