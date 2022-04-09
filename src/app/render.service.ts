import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import * as JsonToXML from 'js2xmlparser';

@Injectable({
  providedIn: 'root',
})
export class RenderService {
  constructor(private http: HttpClient) {}

  public async transformXmlWithXsl(
    xmlDocument: Document,
    xsltDocLocalPath: string
  ): Promise<Document> {
    return firstValueFrom(
      this.http
        .get(xsltDocLocalPath, { responseType: 'text' })
        .pipe(
          map((xslContent) =>
            this.xmlToHtmlTransformer(xmlDocument, xslContent)
          )
        )
    );
  }

  public async transformJsonToDocument(jsonPath: string): Promise<Document> {
    return firstValueFrom(
      this.http
        .get(jsonPath, { responseType: 'json' })
        .pipe(
          map((json) =>
            new DOMParser().parseFromString(this.convertXML(json), 'text/xml')
          )
        )
    );
  }

  removeDoctypeFromXml(htmlDoc: Document) {
    if (htmlDoc.doctype !== null) {
      htmlDoc.doctype.remove();
    }
  }

  convertXML(obj: any) {
    let options = {
      format: {
        doubleQuotes: false,
      },
      declaration: {
        include: false,
      },
    };
    return JsonToXML.parse('result', obj, options);
  }

  private xmlToHtmlTransformer(
    xmlDocument: Document,
    xslContent: string
  ): Document {
    const xslDocument = new DOMParser().parseFromString(xslContent, 'text/xml');
    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xslDocument);
    return xsltProcessor.transformToDocument(xmlDocument);
  }
}
