// index: "序号",
// call_1: "数量"

export const makeTableCellData = (dataIndexMap, data, size) => {
  // console.log(dataIndexMap, data, size, 'size')
  return Object.entries(dataIndexMap).reduce((result, [key, value]) => {
    if (key === 'index') {
      return result;
    }

    result[value] = (data || Array.from({length: size}, () => ({}))).map(
      item => {
        return {
          data: Number(item[key] || 0),
        };
      },
    );
    return result;
  }, {});
};

export const makeTableSum = data => {
  return data.reduce((result, item) => {
    const keys = Object.keys(item).filter(key => key !== 'index');
    keys.forEach(key => {
      result += Number(item[key] || 0);
    });
    return result;
  }, 0);
};

export const makeTableAvg = data => {
  const size = Object.keys(data[0]).filter(key => key !== 'index').length;
  const result = makeTableSum(data);
  return result / size / data.length;
};

export const treeTypeList = [
  {
    value: '1',
    label: '萌芽期',
  },
  {
    value: '2',
    label: '展叶期',
  },
  {
    value: '3',
    label: '初花期',
  },
  {
    value: '4',
    label: '盛花期',
  },
  {
    value: '5',
    label: '末花期',
  },
  {
    value: '6',
    label: '果期',
  },
  {
    value: '7',
    label: '落叶期',
  },
];
