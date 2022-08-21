import maybe from 'maybe-for-sure';
import { FC } from 'react';
import { Folder } from '../../../domain';
import { SelectedFields } from '../../../domain/Inventory';
import { DispatchAction } from '../../../services/redux/store';
import { Select, discogsColors } from '../../styled';

export type Props = {
  folders: Folder[];
  setSelectedFields: DispatchAction<Record<string, string>>;
  selectedFields: SelectedFields;
};

const ListFolders: FC<Props> = ({ folders, selectedFields, setSelectedFields }: Props) => (
  <>
    <label>Folder</label>
    <Select
      onChange={(e) => setSelectedFields({ folders: e.target.value })}
      value={maybe(selectedFields).mapTo(`folders`).valueOr(undefined)}
      background={discogsColors.black}
      color={discogsColors.white}
    >
      {maybe(folders)
        .map((it) =>
          it.map(({ id, name }: Folder) => (
            <option key={`folderId-${id}`} value={id}>
              {name}
            </option>
          )),
        )
        .valueOr(undefined)}
    </Select>
  </>
);

export default ListFolders;
