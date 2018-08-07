import { TranslateLoader } from "@ngx-translate/core";
import { Observable } from "rxjs";

let translations: any = { 'KEY': 'Value' };

export class TranslateLoaderMock implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
      return Observable.of(translations);
    }
}