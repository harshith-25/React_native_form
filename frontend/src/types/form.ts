export interface IFormField {
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

export interface IForm {
  _id?: string;
  title: string;
  description: string;
  fields: IFormField[];
  createdBy?: string;
  shareableLink?: string;
}