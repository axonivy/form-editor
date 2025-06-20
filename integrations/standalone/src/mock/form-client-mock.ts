import type {
  EditorFileContent,
  FormActionArgs,
  FormClient,
  FormData,
  FormEditor,
  FormMetaRequestTypes,
  FormSaveData,
  ValidationResult
} from '@axonivy/form-editor-protocol';
import { validateMock } from './validation-mock';
import { Emitter } from '@axonivy/jsonrpc';
import { data } from './data-mock';
import { ATTRIBUTES, CMSQUICKACTIONS, COMPOSITE_PARAMS, COMPOSITES } from './meta-mock';
import { dataDataTable } from './data-mock-datatable';

export class FormClientMock implements FormClient {
  private formData: FormEditor;
  constructor(datatable: boolean = false) {
    this.formData = {
      context: { app: 'mock', pmv: 'mock', file: 'mock.f.json' },
      readonly: false,
      defaults: {},
      data: (datatable ? dataDataTable : data) as FormData,
      helpUrl: 'https://dev.axonivy.com',
      previewUrl: '',
      namespace: ''
    };
  }

  protected onValidationChangedEmitter = new Emitter<void>();
  onValidationChanged = this.onValidationChangedEmitter.event;
  protected onDataChangedEmitter = new Emitter<void>();
  onDataChanged = this.onDataChangedEmitter.event;
  protected onSelectElementEmitter = new Emitter<string>();
  onSelectElement = this.onSelectElementEmitter.event;

  initialize(): Promise<void> {
    return Promise.resolve();
  }

  data(): Promise<FormEditor> {
    return Promise.resolve(this.formData);
  }

  saveData(saveData: FormSaveData): Promise<EditorFileContent> {
    this.formData.data = saveData.data;
    return Promise.resolve({ content: '' });
  }

  validate(): Promise<ValidationResult[]> {
    return Promise.resolve(validateMock(this.formData.data));
  }

  meta<TMeta extends keyof FormMetaRequestTypes>(path: TMeta): Promise<FormMetaRequestTypes[TMeta][1]> {
    switch (path) {
      case 'meta/data/attributes':
        return Promise.resolve(ATTRIBUTES);
      case 'meta/composite/all':
        return Promise.resolve(COMPOSITES);
      case 'meta/composite/params':
        return Promise.resolve(COMPOSITE_PARAMS);
      case 'meta/cms/cmsQuickActions':
        return Promise.resolve(CMSQUICKACTIONS);
      case 'meta/cms/executeCmsQuickAction':
        return Promise.resolve("#{ivy.cms.co('/Labels/Firstname')}");
      case 'meta/data/logic':
      default:
        throw Error('mock meta path not programmed');
    }
  }

  action(action: FormActionArgs): void {
    console.log('action', JSON.stringify(action));
  }
}
