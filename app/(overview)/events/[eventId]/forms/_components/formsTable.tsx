'use client';

import { ColumnDef } from '@tanstack/react-table';
import DataTable, {
  DeletePopup,
  SortableHeader,
  getFormattedDate,
} from '@/components/DataTable';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { usePathname, useRouter } from 'next/navigation';
import {
  getESFormFromEvent,
  getFTFormFromEvent,
  getRSFormFromEvent,
} from '@/actions/utils';
import { deleteExpenseStatement } from '@/actions/expense_statements';
import FormViewPDF, { pdfGenerate } from '../[formId]/_components/FormViewPDF';
import {
  deleteActivityIncomeValidation,
  selectAllActivityIncomeValidation,
  selectWhereActivityIncomeValidation,
} from '@/actions/activity_incomes';
import {
  deleteFundTransferValidation,
  selectAllFundTransferValidation,
} from '@/actions/fund_transfers';

const EXPENSE_COL_DEF: ColumnDef<unknown, any>[] = [
  {
    accessorKey: 'es_name',
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
  },
  {
    accessorKey: 'es_id',
    header: ({ column }) => (
      <SortableHeader column={column}>Code</SortableHeader>
    ),
  },
  {
    accessorKey: 'es_date',
    header: ({ column }) => (
      <SortableHeader column={column}>Date Created</SortableHeader>
    ),
    cell: ({ row }) => getFormattedDate(new Date(row.getValue('es_date'))),
  },
];

const REVENUE_COL_DEF: ColumnDef<unknown, any>[] = [
  {
    accessorKey: 'rs_name',
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
  },
  {
    accessorKey: 'rs_id',
    header: ({ column }) => (
      <SortableHeader column={column}>Code</SortableHeader>
    ),
  },
  {
    accessorKey: 'rs_date',
    header: ({ column }) => (
      <SortableHeader column={column}>Date Created</SortableHeader>
    ),
    cell: ({ row }) => getFormattedDate(new Date(row.getValue('rs_date'))),
  },
];

const FUND_TRANSFER_COL_DEF: ColumnDef<unknown, any>[] = [
  {
    accessorKey: 'ft_name',
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
  },
  {
    accessorKey: 'ft_id',
    header: ({ column }) => (
      <SortableHeader column={column}>Code</SortableHeader>
    ),
  },
  {
    accessorKey: 'ft_date',
    header: ({ column }) => (
      <SortableHeader column={column}>Date</SortableHeader>
    ),
    cell: ({ row }) => getFormattedDate(new Date(row.getValue('ft_date'))),
  },
  {
    accessorKey: 'ft_from',
    header: ({ column }) => (
      <SortableHeader column={column}>Transfered From</SortableHeader>
    ),
  },
  {
    accessorKey: 'ft_to',
    header: ({ column }) => (
      <SortableHeader column={column}>Transfered To</SortableHeader>
    ),
  },
];

type FormsTableProps = {
  deleteable?: boolean;
  eventId: string;
  nameFilter: string;
  tableData?: any;
  variant: 'expense' | 'revenue' | 'fund_transfer';
};

const FormsTable = ({
  deleteable,
  eventId,
  nameFilter,
  tableData: td,
  variant,
}: FormsTableProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const [tableData, setTableData] = useState<any[]>(td ?? []);

  const [toDeleteId, setToDeleteId] = useState('');
  const [toEditId, setToEditId] = useState('');
  const [toViewId, setToViewId] = useState('');

  useEffect(() => {
    if (!td) {
      fetchTableData();
    }

    async function fetchTableData() {
      let formData;

      switch (variant) {
        case 'expense':
          formData = await getESFormFromEvent(eventId);
          break;

        case 'revenue':
          formData = await getRSFormFromEvent(eventId);
          break;

        case 'fund_transfer':
          formData = await getFTFormFromEvent(eventId);
          break;
      }

      const data = formData!.data!;
      setTableData(data);
    }
  }, [eventId, variant, td]);

  useEffect(() => {
    if (toEditId) {
      router.push(`${pathname}/${toEditId}/edit`);
    }
  }, [pathname, router, toEditId]);

  useEffect(() => {
    // if (toViewId) {
    //   pdfGenerate(<FormViewPDF formId={toViewId} />, `${toViewId}.pdf`);

    //   setToViewId('');
    // }
    console.log(123);

    if (toViewId) {
      router.push(`${pathname}/${toViewId}/`);
      setToViewId('');
    }
  }, [toViewId]);

  function getColumnDefinition() {
    switch (variant) {
      case 'expense':
        return EXPENSE_COL_DEF;

      case 'revenue':
        return REVENUE_COL_DEF;

      case 'fund_transfer':
        return FUND_TRANSFER_COL_DEF;

      default:
        throw new Error('Invalid form variant provided.');
    }
  }

  async function handleFormDelete() {
    if (!toDeleteId) {
      return;
    }

    // TODO: lol
    await deleteFundTransferValidation(toDeleteId, 'ft_id', eventId);
    setToDeleteId('');

    toast({
      variant: 'success',
      title: 'Form Deleted',
      description: `Form successfully deleted.`,
    });
  }

  return (
    <>
      <DataTable
        className="border-2"
        clickableIdColumn={true}
        columns={getColumnDefinition()}
        data={td ?? tableData}
        deletable={deleteable}
        idFilter={nameFilter}
        idColumn={
          variant === 'expense'
            ? 'es_name'
            : variant === 'fund_transfer'
              ? 'ft_name'
              : 'rs_name'
        }
        pkColumn={
          variant === 'expense'
            ? 'es_id'
            : variant === 'fund_transfer'
              ? 'ft_id'
              : 'rs_id'
        }
        onRowEdit={(formId: string) => setToEditId(formId)}
        onRowDelete={(formId: string) => setToDeleteId(formId)}
        onRowSelect={(formId: string) => setToViewId(formId)}
      />

      <DeletePopup
        type="Form"
        open={!!toDeleteId}
        onCancel={() => setToDeleteId('')}
        onConfirm={handleFormDelete}
      />
    </>
  );
};

export default FormsTable;
