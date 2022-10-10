import maybe from '@hansogj/maybe';
import React from 'react';
import { DropdownInventoryField, InventoryFields } from '../../../domain';
import { SelectedFields } from '../../../domain/Inventory';
import { DispatchAction } from '../../../services/redux/store';
import { Column, Row, Select } from '../../styled';

export type Props = {
  fields: InventoryFields;
  selectedFields: SelectedFields;
  setSelectedFields: DispatchAction<SelectedFields>;
};

const ListFields = ({ fields, selectedFields, setSelectedFields }: Props) => (
  <Row>
    {fields.map(({ type, name, id, ...field }) => (
      <Column width={10} height={4} key={`fieldId-${id}-col`} padding={[0.2, 0]}>
        <label>{name}</label>
        {type === 'dropdown' && (
          <Select
            value={maybe(selectedFields).mapTo(`${id}`).valueOr(undefined)}
            onChange={(e) => setSelectedFields({ [id]: e.target.value })}
            width={10}
            padding={[0.2]}
          >
            {maybe((field as DropdownInventoryField).options)
              .map((it) => [undefined, ...it])
              .map((it) =>
                it.map((option: Optional<string>) => (
                  <option key={`fieldId-${id}-${option}`} value={option}>
                    {option}
                  </option>
                )),
              )
              .valueOr(undefined)}
          </Select>
        )}
      </Column>
    ))}
  </Row>
);

export default ListFields;
