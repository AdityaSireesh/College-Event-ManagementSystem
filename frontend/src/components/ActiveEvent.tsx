import { useLocation } from "react-router-dom";

function ActiveEvent() {
  const location = useLocation();
  const event = (location.state as any)?.event;
  
  if (!event) {
    return <h2 className="p-8 text-center text-xl font-bold">No Event Data Found</h2>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          {event.title}
        </h1>
        <h2 className="text-xl font-bold mb-4">
          Organized by {event.ownerName}
        </h2>
        <hr className="border-gray-300 my-4" />
            
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Event Details
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Date:</strong> {event.date ? new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBA'}</p>
              <p><strong>Time:</strong> {event.time || 'TBA'}</p>
              <p><strong>Description:</strong></p>
              <p className="whitespace-pre-wrap">{!event.a_description ? "No description provided" : event.a_description}</p>
              <p><strong>Venue:</strong> {event.venue || 'TBA'}</p>
              <p><strong>Activity Points:</strong> {event.activityPoints ? "Yes" : "No"}</p>
              <p><strong>Fee:</strong> {event.fee === 0 || event.fee === "Free" ? "Free" : `₹ ${event.rate}`}</p>
              
              {event.registrationLink && (
                <div className="pt-4">
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noreferrer">
                    <button className="px-5 py-2 bg-purple-800 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                      Register
                    </button>
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src={`http://localhost:3000/events/${event.id}/poster`}
              alt="poster"
              className="rounded-lg shadow-lg max-h-[700px] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActiveEvent;