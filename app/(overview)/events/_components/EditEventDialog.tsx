import { EventState, editEvent } from '@/actions/events';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import EventDialogForm from './EventDialogForm';

type EditEventDialogProps = {
  eventId: string;
  onFinish: () => void;
};

const EditEventDialog = ({ eventId, onFinish }: EditEventDialogProps) => {
  const initialState: EventState = { message: null, errors: {} };
  const [state, formAction] = useFormState(editEvent, initialState);

  useEffect(() => {
    // fetch initial info
  }, [eventId]);

  return (
    <EventDialogForm
      action={formAction}
      label={'Edit'}
      state={state}
      open={!!eventId}
      onOpenChange={onFinish}
    />
  );
};

export default EditEventDialog;
