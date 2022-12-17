import { InventoryFields } from '../../../domain';
import { SelectedFields } from '../../../domain/Inventory';
import { DispatchAction } from '../../../services/redux/store';
import { Folder } from '../../../domain';

export type ListFoldersProps = {
  folders: Folder[];
  setSelectedFields: DispatchAction<Record<string, string>>;
  selectedFields: SelectedFields;
};

export type ListFieldsProps = {
  fields: InventoryFields;
  selectedFields: SelectedFields;
  setSelectedFields: DispatchAction<SelectedFields>;
};
