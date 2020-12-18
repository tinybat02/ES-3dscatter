import { DataFrame, Field, Vector } from '@grafana/data';

export interface PanelOptions {
  flat_area: { [key: string]: number } | null;
  filename: string;
}

export const defaults: PanelOptions = {
  flat_area: null,
  filename: '',
};

export interface Buffer extends Vector {
  buffer: number[];
}

export interface FieldBuffer extends Field<any, Vector> {
  values: Buffer;
}

export interface Frame extends DataFrame {
  fields: FieldBuffer[];
}

export interface DataM {
  x: number[];
  y: number[];
  z: number[];
  text: string[];
  hovertemplate: string;
  type: string;
  mode: string;
  marker: object;
}

export interface CSVRow {
  Store: string;
  'Area (m2)': number;
  Customers: number;
  'Timespent (min)': number;
}
