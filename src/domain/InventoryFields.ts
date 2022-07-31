interface CommonInventoryField {
  id: number;
  name: string;
  position: number;
  public: boolean;
}
export interface DropdownInventoryField extends CommonInventoryField {
  type: "dropdown";
  options: Array<string>;
}

export interface TextareaInventoryFields extends CommonInventoryField {
  type: "textarea";
  lines: number;
}

export type InventoryFields = Array<
  DropdownInventoryField | TextareaInventoryFields
>;
