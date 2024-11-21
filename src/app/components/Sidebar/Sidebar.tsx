const Sidebar = ({
  connectionStatus,
  rate,
  timeElapsed,
  totalEvents,
}: {
  connectionStatus: string;
  rate: number;
  timeElapsed: number;
  totalEvents: number;
}) => {
  return (
    <div className="border border-gray-200 p-4 h-full bg-slate-200 rounded min-w-[250px]">
      <h2 className="mb-2">Metrics</h2>
      <div className="flex flex-col">
        <div role="status" aria-live="polite" className="flex justify-between items-end">
          <span id="connection-status-label" className="font-medium text-gray-600">
            Connection Status:
          </span>
          <span aria-labelledby="connection-status-label" className="font-bold" cy-data="connection-status">
            {connectionStatus}
          </span>
        </div>
        <div className="border-b border-gray-300 my-2"></div>

        <div role="status" aria-live="polite" className="flex justify-between items-center">
          <span id="event-count-label" className="font-medium text-gray-600">
            Event Count:
          </span>
          <span aria-labelledby="event-count-label" className="font-bold" cy-data="event-count">
            {totalEvents}
          </span>
        </div>
        <div className="border-b border-gray-300 my-2"></div>

        <div role="status" aria-live="polite" className="flex justify-between items-center">
          <span id="event-rate-label" className="font-medium text-gray-600">
            Events/Minute:
          </span>
          <span aria-labelledby="event-rate-label" className="font-bold" cy-data="event-rate">
            {rate}
          </span>
        </div>
        <div className="border-b border-gray-300 my-2"></div>
        <div role="status" aria-live="polite" className="flex justify-between items-center">
          <span id="time-elapsed-label" className="font-medium text-gray-600">
            Time Elapsed (in seconds):
          </span>
          <span aria-labelledby="time-elapsed-label" className="font-bold" cy-data="time-elapsed">
            {timeElapsed}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
