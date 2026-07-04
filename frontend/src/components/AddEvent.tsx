import { useState } from "react";
import axios from "axios";
import Addons from "./Addons";

function AddEvent() {
  const { setIsLoading, showFlash, UIOverlay } = Addons();
  const [eventName, setEventName] = useState("");
  const [activityPoints, setActivityPoints] = useState("No");
  const [rate, setRate] = useState("Free");
  const [poster, setPoster] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");  
  const [time, setTime] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [venue, setVenue] = useState("");
  const [fee, setFee] = useState("");


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      if (!file.type.startsWith("image/")) {
        showFlash("Invalid file type! Please select an image file.", "error");
        setPoster(null);
        e.target.value = ""; 
        return;
      }

      const MAX_FILE_SIZE = 10 * 1024 * 1024; 
      if (file.size > MAX_FILE_SIZE) {
        showFlash("File is too large! Maximum allowed size is 10MB.", "error");
        setPoster(null);
        e.target.value = "";
        return;
      }
      
      setPoster(file);
    }
    else {
      setPoster(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        setIsLoading(true);
        const role = localStorage.getItem("role");
        const UserId = localStorage.getItem("UserId");

        const formData = new FormData();

        formData.append("title", eventName);

        if(date)
          formData.append("date", date);

          formData.append("time", time);
          formData.append("venue", venue);

          formData.append(
              "activityPoints",
              (activityPoints === "Yes").toString()
          );

        formData.append(
          "rate",
          rate === "Free" ? "0" : (fee || "0")
        );

        formData.append("registrationLink", registrationLink);
        formData.append("status", "Active");
        formData.append("a_desc", description);

        if (role)
            formData.append("role", role);

        if (UserId)
            formData.append("OwnerId", UserId);

        if (poster)
            formData.append("poster", poster);
        
        const response = await axios.post(
            "http://localhost:3000/events/add",
            formData
        );

        showFlash(response.data.msg, "success");

        setEventName("");
        setActivityPoints("No");
        setRate("Free");
        setPoster(null);
        setDescription("");
        setDate("");
        setTime("");
        setVenue("");
        setFee("");
        setRegistrationLink("");
        
        const fileInput = document.getElementById("poster") as HTMLInputElement;
        if (fileInput)
          fileInput.value = "";
      }

    catch (err) {
        console.error(err);
        showFlash("Failed to create event.", "error");
    }
    finally {
      setIsLoading(false);
    }
};

  return (
    <>
      <UIOverlay />
    <form 
        onSubmit={handleSubmit} 
        className="flex flex-col gap-5 text-gray-700 text-sm font-medium">
        <div className="w-full max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow-sm mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Add Event</h2>
                  
            <div className="flex flex-col">
              <label htmlFor="eventName" className="mb-2">Event Name:</label>
              <input
                id="eventName"
                type="text"
                placeholder="Enter event name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">

            <div className="flex flex-col">
            <label htmlFor="date" className="mb-2">
              Date:
            </label>

            <input
              id="date"
              type="date"
              min="2012-01-01"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

            <div className="flex flex-col">
              <label htmlFor="time" className="mb-2">Time:</label>
              <input
                id="time"
                type="text"
                placeholder="Enter time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

          </div>

            <div className="flex flex-col">
              <label htmlFor="venue" className="mb-2">Venue:</label>
              <input
                id="venue"
                type="text"
                placeholder="Enter venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-col">
              <span className="block mb-2">Activity Points:</span>
              <div className="flex gap-4">
                {["No", "Yes"].map((option) => (
                  <label key={option} className="flex items-center gap-2 font-normal cursor-pointer mb-4">
                    <input
                      type="radio"
                      name="activityPoints"
                      value={option}
                      checked={activityPoints === option}
                      onChange={(e) => setActivityPoints(e.target.value)}
                      className="accent-purple-600 w-4 h-4"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
            <span className="block mb-2">Rate:</span>

            <div className="flex items-center gap-6 mb-4">

              {["Free", "Priced"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 font-normal cursor-pointer"
                >
                  <input
                    type="radio"
                    name="rate"
                    value={option}
                    checked={rate === option}
                    onChange={(e) => setRate(e.target.value)}
                    className="accent-purple-600 w-4 h-4"
                  />
                  {option}
                </label>
              ))}

              {rate === "Priced" && (
                <input
                  type="text"
                  placeholder="Enter Fee"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              )}

            </div>
          </div>

          <div className="flex flex-col">
              <label htmlFor="registrationLink" className="mb-2">Registration Link:</label>
              <input
                id="registrationLink"
                type="text"
                placeholder="Enter registration link"
                value={registrationLink}
                onChange={(e) => setRegistrationLink(e.target.value)}
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
          </div>

            <div className="flex flex-col">
              <label htmlFor="poster" className="font-medium text-gray-700 mb-2">Event Poster Image (Max 10MB):</label>
              <input
                id="poster"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full mb-4 text-gray-500 border border-gray-300 rounded file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="description" className="mb-2">Description:</label>
              <textarea
                id="description"
                placeholder="Provide event details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 resize-y"
              ></textarea>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="w-32 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 shadow-sm transition-colors text-center"
              >
                Submit
              </button>
            </div>
        </div>
      </form>
      </>
  );
}

export default AddEvent;