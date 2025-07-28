/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  AttributesContext,
  CmsQuickAction,
  CmsQuickActionRequest,
  CompositeContext,
  CompositeData,
  CompositeInfo,
  ContentObject,
  EditorFileContent,
  ExecuteCmsQuickActionRequest,
  ExtractContext,
  FormActionArgs,
  FormCmsMetaRequest,
  FormContext,
  LogicInfo,
  ParameterInfo,
  ValidationResult,
  VariableInfo
} from './data/form';
import type { FormEditor, FormSaveData } from './data/form-data';

export interface FormMetaRequestTypes {
  'meta/data/attributes': [AttributesContext, VariableInfo];
  'meta/data/logic': [FormContext, LogicInfo];
  'meta/cms/cmsTree': [FormCmsMetaRequest, Array<ContentObject>];
  'meta/cms/executeCmsQuickAction': [ExecuteCmsQuickActionRequest, string];
  'meta/cms/cmsQuickActions': [CmsQuickActionRequest, Array<CmsQuickAction>];
  'meta/composite/all': [FormContext, Array<CompositeInfo>];
  'meta/composite/params': [CompositeContext, Array<ParameterInfo>];
  'meta/composite/data': [CompositeContext, CompositeData];
  extractIntoComponent: [ExtractContext, string];
}

export interface FormRequestTypes extends FormMetaRequestTypes {
  initialize: [FormContext, void];
  data: [FormContext, FormEditor];
  saveData: [FormSaveData, EditorFileContent];

  validate: [FormContext, ValidationResult[]];
}

export interface FormNotificationTypes {
  action: FormActionArgs;
}

export interface FormOnNotificationTypes {
  dataChanged: void;
  validationChanged: void;
  selectElement: string;
}
