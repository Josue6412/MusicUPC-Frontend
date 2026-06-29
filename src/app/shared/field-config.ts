export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'date'
  | 'time'
  | 'checkbox'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'file';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  options?: SelectOption[];
  min?: number | string;
  max?: number | string;
  pattern?: string;
}

export interface EntityFormData<T = Record<string, unknown>> {
  title: string;
  fields: FieldConfig[];
  model?: Partial<T>;
}
