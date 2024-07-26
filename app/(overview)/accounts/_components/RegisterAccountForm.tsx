'use client';

import { RegisterAccountState } from '@/actions/account';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToastAction } from '@/components/ui/toast';
import { toast } from '@/components/ui/use-toast';
import React, { useEffect, useState } from 'react';
import ErrorDisplay from '../../events/[eventId]/_components/ErrorDisplay';

interface EventDialogFormProps {
  action: any; // TODO
  fields?: any; // TODO
  label: string;
  state: RegisterAccountState;
  open: boolean;
  onFieldsChange?: (v: any) => void; // TODO
  onOpenChange: (v: boolean) => void;
}

const RegisterAccountForm: React.FC<EventDialogFormProps> = ({
  action,
  fields,
  label,
  state,
  open,
  onFieldsChange,
  onOpenChange,
}) => {
  useEffect(() => {
    if (!state.errors) {
      onOpenChange(true);

      toast({
        variant: 'success',
        title: 'Hooray',
        description: `Event successfully ${true ? 'edited' : 'created'}.`,
        action: <ToastAction altText="Try again">Exit</ToastAction>,
      });
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{label} Account</DialogTitle>
        </DialogHeader>

        <form action={action}>
          <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-col gap-2">

              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="staff_position"
                placeholder="Receipts Link"
              />
              <ErrorDisplay errors={state.errors?.staff_position} />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">{label}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterAccountForm;
