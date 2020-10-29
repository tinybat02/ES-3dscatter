import { Frame, DataM } from '../types';

export const processData = (data: Array<Frame>, yStore: { [key: string]: number }): DataM[] => {
  const xData: number[] = [];
  const yData: number[] = [];
  const zData: number[] = [];
  const textData: string[] = [];

  const xStore: { [key: string]: number } = {};
  const zStore: { [key: string]: number } = {};
  data.map(row => {
    if (!row.name) return;

    if (row.name.startsWith('num')) {
      zStore[row.name.split('num')[1]] = row.fields[0].values.buffer.slice(-1)[0];
    } else {
      xStore[row.name] = Math.round(row.fields[0].values.buffer.slice(-1)[0] / 6) / 10;
    }
  });

  Object.keys(xStore).map(store => {
    if (zStore[store] && yStore[store]) {
      xData.push(xStore[store]);
      yData.push(yStore[store]);
      zData.push(zStore[store]);
      textData.push(store);
    }
  });

  return [
    {
      x: xData,
      y: yData,
      z: zData,
      text: textData,
      hovertemplate: '<b>%{text}</b><br>' + '%{z} People<br>' + '%{x} min<br>' + '%{y} m2',
      type: 'scatter3d',
      mode: 'markers',
      marker: { size: 5 },
    },
  ];
};