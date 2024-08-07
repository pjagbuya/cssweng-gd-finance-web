import { selectAllEventValidation } from '@/actions/events';
import SearchInput from '@/components/SearchInput';

import CreateEventButton from './_components/CreateEventButton';
import EventsTable from './_components/EventsTable';
import FilterEventButton from './_components/FilterEventButton';

type EventsPageProps = {
  searchParams?: {
    endDate?: Date;
    query?: string;
    startDate?: Date;
  };
};

const EventsPage = async ({ searchParams }: EventsPageProps) => {
  const { data } = await selectAllEventValidation();

  return (
    <main className="flex flex-col gap-4 px-6 py-4 text-left">
      <div className="mb-1">
        <h2 className="text-2xl font-bold">Events Dashboard</h2>
        <p>Create, edit, and update GDSC events.</p>
      </div>

      <div className="flex justify-between">
        <CreateEventButton />

        <div className="flex max-w-96 flex-1 gap-4">
          <SearchInput placeholder="Search events by name..." />

          <FilterEventButton />
        </div>
      </div>

      <EventsTable events={data} nameFilter={searchParams?.query || ''} />
    </main>
  );
};

export default EventsPage;
