import type { ConditionData, ConditionGroupData, ConditionMode, LogicOperator, LogicOperators, Operators } from '@axonivy/ui-components';

export const operators: Operators = {
  'equal to': 'eq',
  'not equal to': 'ne',
  'is true': 'isTrue',
  'is false': 'isFalse',
  'is empty': 'isEmpty',
  'is not empty': 'isNotEmpty',
  'less than': 'lt',
  'greater than': 'gt',
  'less or equal to': 'le',
  'greater or equal to': 'ge'
};

export const logicOperators: LogicOperators = {
  and: 'and',
  or: 'or'
};

const getLogicalOperator = (index: number, totalConditions: number, logicalOperator: LogicOperator) => {
  return index < totalConditions - 1 ? ` ${logicOperators[logicalOperator].toLowerCase()} ` : '';
};

const formatCondition = (con: ConditionData, formattedArg1: string, formattedArg2: string, logicalOp: string) => {
  switch (con.operator) {
    case 'is true':
      return `${formattedArg1}${logicalOp}`;
    case 'is false':
      return `!${formattedArg1}${logicalOp}`;
    case 'is empty':
      return `empty ${formattedArg1}${logicalOp}`;
    case 'is not empty':
      return `not empty ${formattedArg1}${logicalOp}`;
    default:
      return `${formattedArg1} ${operators[con.operator]} ${formattedArg2}${logicalOp}`;
  }
};

export const generateConditionString = (conditionMode: ConditionMode, conditionGroups: ConditionGroupData[]) => {
  if (conditionMode === 'always-true') {
    return 'true';
  }
  if (conditionMode === 'always-false') {
    return 'false';
  }
  const wrapInQuotesIfNeeded = (arg: string) => {
    return arg.startsWith('data.') || arg === 'data' || arg.startsWith('currentRow.') || arg === 'currentRow' ? arg : `'${arg}'`;
  };

  const groupStrings = conditionGroups.map((group, index) => {
    if (conditionMode === 'basic-condition' && index > 0) return '';
    const conditions = group.conditions
      .map((con, conditionIndex) => {
        const formattedArg1 = wrapInQuotesIfNeeded(con.argument1);
        const formattedArg2 = wrapInQuotesIfNeeded(con.argument2);
        const logicalOp = getLogicalOperator(conditionIndex, group.conditions.length, con.logicalOperator);
        return formatCondition(con, formattedArg1, formattedArg2, logicalOp);
      })
      .join('');

    const logicGroupOp = index < conditionGroups.length - 1 ? group.logicalOperator.toLowerCase() : '';
    return conditionGroups.length === 1 || conditionMode === 'basic-condition'
      ? conditions
      : `(${conditions})${logicGroupOp ? ` ${logicGroupOp} ` : ''}`;
  });

  return groupStrings.join('');
};
