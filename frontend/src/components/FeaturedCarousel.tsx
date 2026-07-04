import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { CalendarX } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function FeaturedCarousel({ events }: { events: any[] }) {
  const navigate = useNavigate();

  const activeEvents = events.filter((event) => event.status === "Active");

  if (activeEvents.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-5 h-[250px] bg-slate-200 rounded-xl flex flex-col items-center justify-center mb-1">
        <CalendarX className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-slate-400">No Active Events</h2>
        <p className="text-slate-500 mt-2">Check back later for exciting upcoming activities!</p>
      </div>
    );
  }

  return (
    <div className="featured-carousel w-full max-w-7xl mx-auto mt-5 h-[450px] bg-black rounded-xl overflow-hidden mb-1 shadow-md">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={activeEvents.length > 1}
        className="carousel-swiper w-full h-full"
      >
        {activeEvents.map((event) => (
          <SwiperSlide key={event.id}>
            <div className="carousel-slide relative w-full h-full flex items-center justify-center">
              <img
                src={event.poster}
                alt={event.title}
                className="carousel-poster absolute inset-0 w-full h-full object-contain"
              />

              <div className="carousel-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="carousel-content absolute bottom-0 left-0 w-full p-8 z-10 text-white">
                <span className="carousel-badge">{event.ownerName}</span>
                <h2 className="carousel-event-title text-2xl font-bold mb-2">{event.title}</h2>
                <p className="carousel-meta text-sm text-gray-300 mb-2">
                  📅 {event.date ? new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBA'} &nbsp;|&nbsp; 📍 {event.venue ? event.venue : 'TBA'}
                </p>
                <p className="carousel-description text-sm text-gray-200 line-clamp-2 mb-4">
                  {event.description}
                </p>

                <div className="carousel-actions flex gap-4">
                  <button
                    className="btn-details px-4 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
                    onClick={() => navigate(`/activeevent/${event.id}`, { state: { event: event } })}
                  >
                    View Details
                  </button>
                  {event.registrationLink && (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-register px-4 py-2 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition"
                    >
                      Register Now
                    </a>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default FeaturedCarousel;