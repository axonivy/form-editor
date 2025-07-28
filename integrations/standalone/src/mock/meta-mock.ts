import type { CmsQuickAction, CompositeInfo, ParameterInfo, VariableInfo } from '@axonivy/form-editor-protocol';

export const ATTRIBUTES: VariableInfo = {
  types: {
    'testform.Person': [
      {
        attribute: 'address',
        description: '',
        simpleType: 'Address',
        type: 'testform.Address'
      },
      {
        attribute: 'birthday',
        description: '',
        simpleType: 'Number',
        type: 'Number'
      },
      {
        attribute: 'firstname',
        description: '',
        simpleType: 'String',
        type: 'String'
      }
    ],
    'testform.Address': [
      {
        attribute: 'address',
        description: '',
        simpleType: 'String',
        type: 'String'
      }
    ],
    'testform.testForm.testFormData': [
      {
        attribute: 'data',
        description: '',
        simpleType: 'Data',
        type: 'testform.Data'
      }
    ],
    'testform.Data': [
      {
        attribute: 'persons',
        description: '',
        simpleType: 'List<Person>',
        type: 'List<testform.Person>'
      },
      {
        attribute: 'strings',
        description: '',
        simpleType: 'List<String>',
        type: 'List<String>'
      }
    ]
  },
  variables: [
    {
      attribute: 'data',
      description: '',
      simpleType: 'testFormData',
      type: 'testform.testForm.testFormData'
    }
  ]
};

export const getGenericAttributes = (variableName: string, field: string): VariableInfo => {
  if (field == 'data.data.strings') {
    return {
      types: {
        'java.lang.String': [
          {
            attribute: 'string',
            description: '',
            simpleType: 'String',
            type: 'String'
          }
        ]
      },
      variables: [
        {
          attribute: variableName,
          description: '',
          simpleType: 'string',
          type: 'testform.string'
        }
      ]
    };
  } else {
    return {
      types: {
        'testform.Person': [
          {
            attribute: 'address',
            description: '',
            simpleType: 'Address',
            type: 'testform.Address'
          },
          {
            attribute: 'birthday',
            description: '',
            simpleType: 'Number',
            type: 'Number'
          },
          {
            attribute: 'firstname',
            description: '',
            simpleType: 'String',
            type: 'String'
          }
        ],
        'testform.Address': [
          {
            attribute: 'address',
            description: '',
            simpleType: 'String',
            type: 'String'
          }
        ]
      },
      variables: [
        {
          attribute: variableName,
          description: '',
          simpleType: 'person',
          type: 'testform.Person'
        }
      ]
    };
  }
};

export const COMPOSITES: Array<CompositeInfo> = [
  {
    id: 'form.test.project.AddressComponent',
    startMethods: [
      {
        name: 'start',
        parameters: [{ name: 'address', type: 'form.test.project.Address', description: 'Address for the component' }],
        deprecated: false
      },
      { name: 'empty', parameters: [], deprecated: false }
    ]
  },
  {
    id: 'form.test.project.PersonComponent',
    startMethods: [
      {
        name: 'start',
        parameters: [{ name: 'person', type: 'form.test.project.Person', description: 'Person for the Component' }],
        deprecated: false
      }
    ]
  }
];

export const CMSQUICKACTIONS: Array<CmsQuickAction> = [
  {
    category: 'global',
    coContent: '',
    coName: 'Firstname',
    parentUri: '/Labels/'
  },
  {
    category: 'local',
    coContent: '',
    coName: 'Firstname',
    parentUri: '/Dialogs/'
  }
];

export const COMPOSITE_PARAMS: Array<ParameterInfo> = [{ name: 'info', type: 'String', description: 'Information' }];
