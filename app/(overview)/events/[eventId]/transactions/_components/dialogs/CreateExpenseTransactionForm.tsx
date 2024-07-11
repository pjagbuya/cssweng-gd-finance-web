import { useFormState } from 'react-dom';

import { addExpense } from '@/actions/transactions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import CreateForm from '../../../_components/CreateForm';
import ErrorDisplay from '../../../_components/ErrorDisplay';
import { useEffect, useRef } from 'react';

type CreateExpenseTransactionFormProps = {
  onFinish?: () => void;
};

const CreateExpenseTransactionForm = ({
  onFinish,
}: CreateExpenseTransactionFormProps) => {
  const dateElemRef = useRef<HTMLInputElement>(null);

  const [state, action] = useFormState(addExpense, {
    errors: {},
  });

  useEffect(() => {
    dateElemRef.current!.value = new Date().toISOString().substring(0, 10);
  }, []);

  return (
    <CreateForm
      action={action}
      state={state}
      title="Add Expense"
      onFinish={onFinish}
    >
      <>
        <Label htmlFor="date">Date</Label>
        <Input
          ref={dateElemRef}
          type="date"
          id="date"
          name="date"
          placeholder="Date"
          value={Date.now()}
        />

        <ErrorDisplay errors={state?.errors?.date} />
      </>

      <>
        <Label htmlFor="item_name">Item Name</Label>
        <Input id="item_name" name="item_name" placeholder="Item Name" />

        <ErrorDisplay errors={state?.errors?.item_name} />
      </>

      <>
        <Label htmlFor="unit_count">Unit Count</Label>
        <Input
          type="number"
          id="unit_count"
          name="unit_count"
          placeholder="Unit Count"
          defaultValue={1}
          min={1}
        />

        <ErrorDisplay errors={state?.errors?.unit_count} />
      </>

      <>
        <Label htmlFor="unit_price">Unit Price</Label>
        <Input
          type="number"
          id="unit_price"
          name="unit_price"
          placeholder="Unit Price"
          defaultValue={1}
          min={1}
          step="any"
        />

        <ErrorDisplay errors={state?.errors?.unit_price} />
      </>

      <>
        <Label htmlFor="acc_to">Account Transferred To</Label>
        <Input id="acc_to" name="acc_to" placeholder="Account Transferred To" />

        <ErrorDisplay errors={state?.errors?.acc_to} />
      </>
    </CreateForm>
  );
};

export default CreateExpenseTransactionForm;
