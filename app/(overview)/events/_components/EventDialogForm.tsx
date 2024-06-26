import { EventState } from '@/actions/events';
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
import React from 'react';

interface EventDialogFormProps {
  action: any; // TODO
  fields?: any; // TODO
  label: string;
  state: EventState;
  open: boolean;
  onFieldsChange?: (v: any) => void; // TODO
  onOpenChange: (v: boolean) => void;
}

const EventDialogForm: React.FC<EventDialogFormProps> = ({
  action,
  fields,
  label,
  state,
  open,
  onFieldsChange,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{label} Event</DialogTitle>
        </DialogHeader>

        <form action={action}>
          <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name" />

              <div id="name-error" aria-live="polite" aria-atomic="true">
                {state.errors?.name &&
                  state.errors.name.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={() => onOpenChange(false)}>
              {label}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialogForm;
