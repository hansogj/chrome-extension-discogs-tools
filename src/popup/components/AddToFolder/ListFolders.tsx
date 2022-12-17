import maybe from '@hansogj/maybe';
import { FC } from 'react';
import { Folder } from '../../../domain';
import { discogsColors, Select } from '../../styled';

import { ListFoldersProps } from './types';
const ListFolders: FC<ListFoldersProps> = ({
  folders,
  selectedFields,
  setSelectedFields,
}: ListFoldersProps) => (
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
