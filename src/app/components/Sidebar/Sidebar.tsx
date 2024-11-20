const Sidebar = () => {
  return (
    <div className="border border-gray-200 p-4">
      <h2>Sidebar</h2>
      <div role="status" aria-live="polite">
        <span id="event-count-label">Event Count:</span>
        <span aria-labelledby="event-count-label">0</span>
      </div>
      <div role="status" aria-live="polite">
        <span id="event-rate-label">Events/Minute:</span>
        <span aria-labelledby="event-rate-label">0</span>
      </div>
    </div>
  );
};

export default Sidebar;
