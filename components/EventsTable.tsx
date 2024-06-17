'use client';

import { useState } from 'react';

import { ColumnDef } from '@tanstack/react-table';
import DataTable, {
  DeletePopup,
  SortableHeader,
  getFormattedDate,
} from './DataTable';
import EditEventDialog from './EditEventDialog';

const TEMP_COLUMNS: ColumnDef<unknown, any>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
  },
  {
    accessorKey: 'dateCreated',
    header: ({ column }) => (
      <SortableHeader column={column}>Date Created</SortableHeader>
    ),
    cell: ({ row }) => getFormattedDate(new Date(row.getValue('dateCreated'))),
  },
  {
    accessorKey: 'dateModified',
    header: ({ column }) => (
      <SortableHeader column={column}>Date Modified</SortableHeader>
    ),
    cell: ({ row }) => getFormattedDate(new Date(row.getValue('dateModified'))),
  },
];

const TEMP_DATA = [
  {
    name: 'Event 1',
    dateCreated: new Date('2/2/2023'),
    dateModified: new Date('2/2/2023'),
  },
  {
    name: 'Event 2',
    dateCreated: new Date('2/2/2023'),
    dateModified: new Date('2/2/2023'),
  },
  {
    name: 'Event 3',
    dateCreated: new Date('2/2/2023'),
    dateModified: new Date('2/2/2023'),
  },
];

type EventsTableProps = {
  nameFilter: string;
  onDelete?: () => void;
  onEdit?: () => void;
};

const EventsTable = ({ nameFilter, onDelete, onEdit }: EventsTableProps) => {
  const [toDeleteId, setToDeleteId] = useState('');
  const [toEditId, setToEditId] = useState('');

  return (
    <>
      <DataTable
        className="border-2"
        columns={TEMP_COLUMNS}
        data={TEMP_DATA}
        idFilter={nameFilter}
        idColumn="name"
        onRowEdit={() => setToEditId('123')}
        onRowDelete={() => setToDeleteId('123')}
      />

      <DeletePopup
        type="Event"
        open={!!toDeleteId}
        onCancel={() => setToDeleteId('')}
        onConfirm={onDelete ?? (() => {})}
      />

      <EditEventDialog
        isEditing={true}
        open={!!toEditId}
        onCancel={() => setToEditId('')}
        onConfirm={onEdit ?? (() => {})}
      />
    </>
  );
};

export default EventsTable;