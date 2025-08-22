import type { LogicEventInfo, LogicInfo, LogicMethodInfo } from '@axonivy/form-editor-protocol';
import { convertEventsToMethods, formatLogicMethodInfo, logicTreeData } from './logic-tree-data';

const logicInfo: LogicInfo = {
  startMethods: [
    {
      name: 'calculateInterest',
      description: 'Calculates the interest amount',
      parameters: [
        { name: 'principal', type: 'Number' },
        { name: 'rate', type: 'Number' },
        { name: 'time', type: 'Number' }
      ],
      returnParameter: { name: 'interest', type: 'Number' }
    },
    {
      name: 'processPayment',
      description: 'Processes the payment transaction',
      parameters: [
        { name: 'amount', type: 'Number' },
        { name: 'currency', type: 'String' }
      ],
      returnParameter: { name: 'transactionId', type: 'String' }
    }
  ],
  eventStarts: [
    { name: 'onPaymentReceived', description: 'Triggered when payment is received' },
    { name: 'onInterestCalculated', description: 'Triggered when interest is calculated' }
  ]
};

describe('logicTreeData', () => {
  test('of', () => {
    const tree = logicTreeData(logicInfo);
    expect(tree).toHaveLength(2);

    // Check "Events" node
    expect(tree[0]?.value).toEqual('Events');
    expect(tree[0]?.children).toHaveLength(2);
    expect(tree[0]?.children[0]?.value).toEqual('onPaymentReceived');
    expect(tree[0]?.children[1]?.value).toEqual('onInterestCalculated');

    // Check "Methods" node
    expect(tree[1]?.value).toEqual('Methods');
    expect(tree[1]?.children).toHaveLength(2);
    expect(tree[1]?.children[0]?.value).toEqual('calculateInterest(Number, Number, Number)');
    expect(tree[1]?.children[1]?.value).toEqual('processPayment(Number, String)');
  });

  test('convertEventsToMethods', () => {
    const events: LogicEventInfo[] = [
      { name: 'event1', description: 'Event 1 description' },
      { name: 'event2', description: 'Event 2 description' }
    ];
    const methods = convertEventsToMethods(events);
    expect(methods).toHaveLength(2);
    expect(methods[0]?.value).toEqual('event1');
    expect(methods[1]?.value).toEqual('event2');
    expect(methods[0]?.info).toEqual('Event 1 description');
    expect(methods[1]?.info).toEqual('Event 2 description');
  });
});

describe('formatLogicMethodInfo', () => {
  test('formatLogicMethodInfo', () => {
    const methodInfo: LogicMethodInfo = {
      name: 'calculateInterest',
      description: 'Calculates the interest amount',
      parameters: [
        { name: 'principal', type: 'Number' },
        { name: 'rate', type: 'Number' },
        { name: 'time', type: 'Number' }
      ],
      returnParameter: { name: 'interest', type: 'Number' }
    };
    expect(formatLogicMethodInfo(methodInfo)).toEqual('calculateInterest(principal: Number, rate: Number, time: Number):Number');
  });
});
