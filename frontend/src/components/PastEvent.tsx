import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function PastEvent() {
  const location = useLocation();
  const baseEvent = (location.state as any)?.event;
  
  const [fullEvent, setFullEvent] = useState<any>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (baseEvent?.id) {
      axios.get(`http://localhost:3000/events/${baseEvent.id}`)
        .then(res => setFullEvent(res.data))
        .catch(err => console.error("Failed to load full event details", err));
    }
  }, [baseEvent]);

  if (!baseEvent) {
    return <h2 className="p-8 text-center text-xl font-bold">No Event Data Found</h2>;
  }

  const event = fullEvent || baseEvent;
  
  const displayDescription = 
    event.details?.p_desc || 
    event.p_description || 
    event.details?.a_desc || 
    event.a_description;
  
  const imageCount = event.details?.imageCount || 0;
  
  const images = [];
  if (imageCount > 0) {
    for (let i = 0; i < imageCount; i++) {
      images.push(`http://localhost:3000/events/${event.id}/images/${i}`);
    }
  } else if (event.details?.hasPoster || event.poster) {
    images.push(`http://localhost:3000/events/${event.id}/poster`);
  }

  const nextImage = () => {
    if (images.length > 0) {
      setCurrent((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          {event.title}
        </h1>
        <h2 className="text-xl font-bold mb-4">
          Organized by {event.ownerName}
        </h2>
        <br />

        {images.length > 0 && (
          <div className="relative flex items-center justify-center mb-10 h-[500px] w-full bg-black rounded-xl overflow-hidden shadow-md">
            {images.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-4 z-10 bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 flex items-center justify-center rounded-full transition-colors"
              >
                ❮
              </button>
            )}

            <img
              src={images[current]}
              alt="Event Gallery"
              className="w-full h-full object-contain"
            />

            {images.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 z-10 bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 flex items-center justify-center rounded-full transition-colors"
              >
                ❯
              </button>
            )}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4">
            Event Details
          </h2>
          <div className="space-y-3 text-gray-700">       
              <p><strong>Date:</strong> {event.date ? new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBA'}</p>
              <p><strong>Time:</strong> {event.time || 'TBA'}</p>
              <p><strong>Description:</strong></p>
              <p className="whitespace-pre-wrap">{displayDescription || "No description provided"}</p>
              <p><strong>Venue:</strong> {event.venue || 'TBA'}</p>
              <p><strong>Activity Points:</strong> {event.activityPoints ? "Yes" : "No"}</p>
              <p><strong>Fee:</strong> {event.rate === 0 || event.fee === "Free" ? "Free" : `₹ ${event.rate}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PastEvent;