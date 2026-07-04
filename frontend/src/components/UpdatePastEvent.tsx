import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Addons from "./Addons";

function UpdatePastEvent() {
  const { setIsLoading, showFlash, UIOverlay } = Addons();
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.eventToEdit;

  const [description, setDescription] = useState(
    event?.details?.p_desc || event?.details?.a_desc || ""
  );
  const [images, setImages] = useState<File[]>([]);

  if (!event) return <h2 className="p-8">No event selected.</h2>;

  const existingImageCount = event.details?.imageCount || 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files ? Array.from(e.target.files) : []);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (images.length > 10) {
    showFlash("You can only upload a maximum of 10 images at once!", "error");
    return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("p_desc", description);

      images.forEach((image) => formData.append("images", image));

      const response = await axios.put(
        `http://localhost:3000/events/update-past/${event.id}`,
        formData
      );

      showFlash(response.data.msg, "success");
      setTimeout(() => navigate("/updateevent"), 900);
    } catch (error: any) {
      showFlash(error.response?.data?.msg || "Failed to update past event.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const previewUrls = images.map((image) => URL.createObjectURL(image));

  return (
    <>
      <UIOverlay />
      <div className="flex flex-col items-center bg-gray-50 pt-6 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900">Update Past Event</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white px-8 py-6 mt-10 rounded-lg shadow-md w-full max-w-4xl border border-gray-200">
          <div className="flex flex-col">
            <label className="block text-m font-semibold mb-2">Event Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg min-h-[250px]"
            />
          </div>

          <div className="flex flex-col">
            <label className="block text-m font-semibold mb-2">Event Images</label>

            {existingImageCount > 0 ? (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Current gallery. Uploading new files will add them to this existing gallery. (Max 10 images at a time)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: existingImageCount }).map((_, index) => (
                    <img
                      key={index}
                      src={`http://localhost:3000/events/${event.id}/images/${index}`}
                      alt={`Event ${index + 1}`}
                      className="h-28 w-full object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            ) : event.details?.hasPoster ? (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Default image copied from the active-event poster:</p>
                <img
                  src={`http://localhost:3000/events/${event.id}/poster`}
                  alt="Default poster"
                  className="h-48 rounded border object-contain"
                />
              </div>
            ) : null}

            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileChange}
              className="w-full mb-4 text-gray-500 border border-gray-300 rounded file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
            />

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {previewUrls.map((url, index) => (
                  <img key={url} src={url} alt={`New preview ${index + 1}`} className="h-28 w-full object-cover rounded border" />
                ))}
              </div>
            )}

            <div className="flex justify-end mt-8">
              <button type="submit" className="px-8 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default UpdatePastEvent;