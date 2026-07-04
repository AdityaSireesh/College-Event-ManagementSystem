import { Search } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Addons from './Addons';
import axios from 'axios';

function UpdateEvent() {
  const { setIsLoading, triggerConfirm, showFlash, UIOverlay } = Addons();

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const role = localStorage.getItem("role");
      const userId = localStorage.getItem("UserId");

      const response = await axios.get("http://localhost:3000/events");
      
      const formattedEvents = response.data
        .filter((evt: any) => {
           if (role === 'Admin') return true;
           
           return evt.OwnerId && evt.OwnerId._id === userId;
        })
        .map((evt: any) => ({
            id: evt.id,
            name: evt.title,
            status: evt.status,
            activityPoints: evt.activityPoints,
            fee: evt.rate
        }));

      setEvents(formattedEvents);
    }
    catch (err) {
        console.error(err);
        showFlash("Failed to fetch events.", "error");
    }
    finally {
          setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);
 
  const handleEdit = async (event: any) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3000/events/${event.id}`);

      if (event.status === "Active") {
        navigate("/updateactiveevent", { state: { eventToEdit: response.data }, });
      }
      else {
        navigate("/updatepastevent", { state: { eventToEdit: response.data }, });
      }
    }
    catch {
      showFlash("Could not load event details.", "error");
    }
    finally {
      setIsLoading(false);
    }
  };

  const changeToPast = async (event: any) => {
    try {
      setIsLoading(true);
      const response = await axios.put(`http://localhost:3000/events/status-past/${event.id}`);
      showFlash(response.data.msg, "success");
      await fetchEvents();
    }
    catch {
      showFlash("Failed to change event status.", "error");
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleStatusClick = (event: any) => {
    if (event.status !== "Active") return;

    triggerConfirm(
      "Mark as Past?",
      `Change "${event.title}" to Past? Its active poster and description will be used as the default past-event content.`,
      () => changeToPast(event)
    );
  };

  const deleteEvent = async (event: any) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`http://localhost:3000/events/delete/${event.id}`);
      showFlash(response.data.msg, "success");
      await fetchEvents();
    }
    catch {
      showFlash("Failed to delete event", "error");
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (event: any) => {
    triggerConfirm(
      "Delete Event",
      `Are you sure you want to permanently delete "${event.title}"?`,
      () => deleteEvent(event)
    );
  };

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <UIOverlay />
      <div className="m-15">
         <div className="w-full mb-8 px-15">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for college events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700"
            />
            </div>
          </div>

        <table className="w-full table-fixed text-left border-collapse overflow-hidden">
          <thead className="bg-purple-300">
            <tr className="text-center">
              <th className="w-full border border-black px-4 py-2">Event</th>
              <th className="w-[120px] border border-black px-4 py-2">Status</th>
              <th className="w-[200px] border border-black px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-black px-4 py-2 break-words white">{event.name}</td>
                <td 
                  className={`border border-black px-4 py-2 font-bold text-center transition-colors ${
                    event.status.toLowerCase() === 'active' 
                      ? 'text-green-700 cursor-pointer hover:bg-green-100' 
                      : 'text-red-600'
                  }`}
                  onClick={() => handleStatusClick(event)}
                  title={event.status === 'Active' ? "Click to mark as Past" : ""}
                >
                  {event.status}
                </td>
                <td className="border border-black px-4 py-2 text-center space-x-6">
                  <button className="inline-flex items-center px-3 py-1 bg-orange-400 text-black rounded-lg border transition-all duration-200 hover:bg-orange-500 hover:scale-110 hover:shadow-md active:scale-95"
                   onClick={() => handleEdit(event)}
                  >
                    Edit
                  </button>
                  <button className="inline-flex items-center px-3 py-1 bg-red-400 text-black rounded-lg border transition-all duration-200 hover:bg-red-500 hover:scale-110 hover:shadow-md active:scale-95"
                   onClick={() => handleDelete(event)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredEvents.length === 0 && (
              <tr>
                <td colSpan={3} className="border border-black px-4 py-6 text-center text-gray-500 font-medium">
                  No events found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UpdateEvent;