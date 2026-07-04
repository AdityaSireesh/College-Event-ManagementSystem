import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Addons from "./Addons";

function UpdateActiveEvent() {
  const { setIsLoading, showFlash, UIOverlay } = Addons();
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.eventToEdit;

  const toDateInput = (value?: string) =>
    value ? new Date(value).toISOString().slice(0, 10) : "";

  const [eventName, setEventName] = useState(event?.title || "");
  const [date, setDate] = useState(toDateInput(event?.date));
  const [time, setTime] = useState(event?.time || "");
  const [venue, setVenue] = useState(event?.venue || "");
  const [registrationLink, setRegistrationLink] = useState(
    event?.registrationLink || ""
  );
  const [activityPoints, setActivityPoints] = useState(
    event?.activityPoints ? "Yes" : "No"
  );
  const [rate, setRate] = useState(event?.rate > 0 ? "Priced" : "Free");
  const [fee, setFee] = useState(event?.rate > 0 ? String(event.rate) : "");
  const [poster, setPoster] = useState<File | null>(null);
  const [description, setDescription] = useState(event?.details?.a_desc || "");

  if (!event) return <h2 className="p-8">No event selected.</h2>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("title", eventName);
      formData.append("date", date);
      formData.append("time", time);
      formData.append("venue", venue);
      formData.append("registrationLink", registrationLink);
      formData.append("activityPoints", String(activityPoints === "Yes"));
      formData.append("rate", rate === "Free" ? "0" : fee || "0");
      formData.append("a_desc", description);

      if (poster) formData.append("poster", poster);

      const response = await axios.put(
        `http://localhost:3000/events/update-active/${event.id}`,
        formData
      );

      showFlash(response.data.msg, "success");
      setTimeout(() => navigate("/updateevent"), 900);
    } catch (error: any) {
      showFlash(error.response?.data?.msg || "Failed to update event.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <UIOverlay />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-gray-700 text-sm font-medium">
        <div className="w-full max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow-sm mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
            Edit Active Event
          </h2>

          <label className="mb-2 block">Event Name:</label>
          <input value={eventName} onChange={(e) => setEventName(e.target.value)} required className="w-full px-3 py-2 mb-4 border rounded-md" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block">Date:</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 mb-4 border rounded-md" />
            </div>
            <div>
              <label className="mb-2 block">Time:</label>
              <input value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-2 mb-4 border rounded-md" />
            </div>
          </div>

          <label className="mb-2 block">Venue:</label>
          <input value={venue} onChange={(e) => setVenue(e.target.value)} className="w-full px-3 py-2 mb-4 border rounded-md" />

          <label className="mb-2 block">Activity Points:</label>
          <div className="flex gap-4 mb-4">
            {["No", "Yes"].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input type="radio" checked={activityPoints === option} onChange={() => setActivityPoints(option)} className="accent-purple-600 w-4 h-4"/>
                {option}
              </label>
            ))}
          </div>

          <label className="mb-2 block">Rate:</label>
          <div className="flex items-center gap-5 mb-4">
            {["Free", "Priced"].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input type="radio" checked={rate === option} onChange={() => setRate(option)} className="accent-purple-600 w-4 h-4"/>
                {option}
              </label>
            ))}
            {rate === "Priced" && (
              <input value={fee} onChange={(e) => setFee(e.target.value)} placeholder="Fee" className="px-3 py-2 border rounded-md" />
            )}
          </div>

          <label className="mb-2 block">Registration Link:</label>
          <input value={registrationLink} onChange={(e) => setRegistrationLink(e.target.value)} className="w-full px-3 py-2 mb-4 border rounded-md" />

          {event.details?.hasPoster && (
            <div className="mb-4">
              <p className="font-medium mb-2">Current Poster:</p>
              <img src={`http://localhost:3000/events/${event.id}/poster`} alt="Current poster" className="max-h-64 rounded border" />
            </div>
          )}

          <label className="mb-2 block">Replace Poster (Max 10MB) (optional):</label>
          <input type="file" accept="image/*" onChange={(e) => setPoster(e.target.files?.[0] || null)} className="w-full mb-4 text-gray-500 border border-gray-300 rounded file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"/>

          <label className="mb-2 block">Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full px-3 py-2 border rounded-md resize-y" />

          <div className="flex justify-center mt-6">
            <button type="submit" className="w-36 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default UpdateActiveEvent;