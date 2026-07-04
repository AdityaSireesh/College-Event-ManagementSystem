import { Link } from "react-router-dom";

function EventCard({ event }: any) {

  const destinationPath = event.status === "Active"
    ? `/activeevent/${event.id}`  
    : `/pastevent/${event.id}`;
  
  return (

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <img
        src={event.poster}
        alt="Event Poster"
        className="w-full h-48 object-cover"
        />
     
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-gray-800">
            {event.title}
          </h3>

          <span
            className={`px-2 py-1 text-xs text-center font-medium rounded-full ${
              event.ownerType === "Society"
                ? "bg-blue-100 text-blue-700"
                : event.ownerType === "Club"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-300 text-amber-700"
            }`}
          >
            {event.ownerName}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p>📆 {event.date ? new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBA'}</p>
          <p>📍 {event.venue ? event.venue : 'TBA'}</p>
        </div>

        <Link
          to={destinationPath}
          state={{ event }}
          className="mt-auto block w-full"
        >
          <button className="px-4 py-2 bg-purple-600 text-white rounded">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}

export default EventCard;