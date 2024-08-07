'use client';

import { useFormState } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ErrorDisplay from '../../../../_components/ErrorDisplay';
import StaffSelector from './CertifiedStaffSelector';
import { editRevenueStatementValidation } from '@/actions/revenue_statements';
import { useEffect, useState } from 'react';
import StaffMultiSelector from './StaffMultiSelector';

type EditRevenueFormPageProps = {
  eventId: string;
  formInfo: any;
};

const EditRevenueFormPage = ({
  eventId,
  formInfo,
}: EditRevenueFormPageProps) => {
  const [values, setValues] = useState({
    receipt_link: formInfo.receipt_link,
    rs_to: formInfo.rs_to,
    rs_on: formInfo.rs_on,
    rs_notes: formInfo.rs_notes,
    certified_staff_id: formInfo.certified_staff_id,
    noted_staff_list_ids: formInfo.noted_staff_list_id,
  });

  const [state, action] = useFormState(
    editRevenueStatementValidation.bind(null, eventId, formInfo.rs_id, 'rs_id'),
    {
      errors: {},
    },
  );

  return (
    <main className="flex flex-col gap-4 px-6 py-4 text-left">
      <div className="mb-1">
        <h2 className="text-2xl font-bold">
          Edit Fields for Revenue Form: {formInfo?.rs_name}
        </h2>
        <p>Report Code: {formInfo?.rs_id}</p>
      </div>

      <form action={action} className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="receipt_link">Receipts Link</Label>
          <Input
            id="receipt_link"
            name="receipt_link"
            placeholder="Receipts Link"
            value={values.receipt_link}
            onChange={e =>
              setValues({ ...values, receipt_link: e.target.value })
            }
          />

          <ErrorDisplay errors={state.errors?.receipt_link} />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="rs_to">Account Transferred To</Label>
          <Input
            id="rs_to"
            name="rs_to"
            placeholder="Account Transferred To"
            value={values.rs_to}
            onChange={e => setValues({ ...values, rs_to: e.target.value })}
          />

          <ErrorDisplay errors={state?.errors?.rs_to} />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="rs_on">Account Transfer On</Label>
          <Input
            type="date"
            id="rs_on"
            name="rs_on"
            placeholder="Account Transfer Date"
            value={values.rs_on}
            onChange={e => setValues({ ...values, rs_on: e.target.value })}
          />

          <ErrorDisplay errors={state?.errors?.rs_on} />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="rs_notes">Notes</Label>
          <Textarea
            id="rs_notes"
            name="rs_notes"
            placeholder="Notes"
            className="resize-none"
            value={values.rs_notes}
            onChange={e => setValues({ ...values, rs_notes: e.target.value })}
          />

          <ErrorDisplay errors={state.errors?.rs_notes} />
        </div>

        <div className="flex flex-col gap-3">
          <StaffSelector
            label="Certified By"
            name="certified_staff_id"
            placeholder="Certified By"
            value={values.certified_staff_id}
            onChange={v => setValues({ ...values, certified_staff_id: v })}
          />
          <ErrorDisplay errors={state.errors?.certified_staff_id} />
        </div>

        <div className="flex flex-col gap-3">
          <StaffMultiSelector
            label="Noted By"
            name="noted_staff_list_ids"
            placeholder="Noted By"
            value={values.noted_staff_list_ids}
          />
          <ErrorDisplay errors={state.errors?.noted_staff_list_id} />
        </div>

        <Button className="self-start" type="submit">
          Finish Edit
        </Button>
      </form>
    </main>
  );
};

export default EditRevenueFormPage;
