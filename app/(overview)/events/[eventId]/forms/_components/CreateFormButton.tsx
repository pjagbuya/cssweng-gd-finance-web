'use client';

import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';
import CreateExpenseForm from './dialogs/CreateExpenseForm';
import CreateRevenueForm from './dialogs/CreateRevenueForm';

type CreateFormButtonProps = {
  eventId: string;
  variant: 'expense' | 'revenue' | 'fund_transfer';
};

const CreateFormButton = ({ eventId, variant }: CreateFormButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);

  function getFormComponent() {
    switch (variant) {
      case 'expense':
        return (
          <CreateExpenseForm
            eventId={eventId}
            onFinish={() => setShowDialog(false)}
          />
        );

      case 'revenue':
        return (
          <CreateRevenueForm
            eventId={eventId}
            onFinish={() => setShowDialog(false)}
          />
        );

      case 'fund_transfer':
        // TODO
        return null;

      default:
        throw new Error('Invalid form variant given.');
    }
  }

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>
        <CirclePlus className="mr-2 w-4" /> Create Form
      </Button>

      {showDialog && getFormComponent()}
    </>
  );
};

export default CreateFormButton;
