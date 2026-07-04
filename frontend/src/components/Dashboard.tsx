import { useEffect, useState } from "react";
import { Search, X, Filter, CalendarDays, RefreshCw } from "lucide-react";
import axios from "axios";
import FeaturedCarousel from "./FeaturedCarousel";
import EventCard from "./EventCard";
import Addons from "./Addons";

function Dashboard() {
  const { setIsLoading, showFlash, UIOverlay } = Addons();
  const [isReady, setIsReady] = useState(false);

  const [events, setEvents] = useState<any[]>([]);
  
  const [searchInput, setSearchInput] = useState("");
  const [ownerInput, setOwnerInput] = useState("All");
  const [ownerNameInput, setOwnerNameInput] = useState("All");
  const [statusInput, setStatusInput] = useState("All");
  const [pointsInput, setPointsInput] = useState("All");
  const [feeInput, setFeeInput] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  
  const [appliedFilters, setAppliedFilters] = useState({
    searchQuery: "",
    filterOwner: "All",
    filterOwnerName: "All",
    filterStatus: "All",
    filterPoints: "All",
    filterFee: "All",
  });

  const societyOptions = ["IEEE", "ISTE", "IEDC", "CSI", "IET"];
  const clubOptions = ["Chess Club", "Raagam", "OpenLabs AI Club", "Nature Club"];
  const collegeOptions = ["MBCET"];

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get('http://localhost:3000/events');
        
        const formattedData = response.data.map((evt: any) => ({
          ...evt,
          fee:evt.rate,
          poster: `http://localhost:3000/events/${evt.id}/poster`,
          a_description: evt.details?.a_desc || "No description provided",
          p_description: evt.details?.p_desc || "No description provided"
        }));
        
        setEvents(formattedData);
      }
      catch (error) {
        showFlash("Failed to fetch events from the server.", "error");
      }
      finally {
        setIsLoading(false);
        setIsReady(true);
      }
    };

    fetchEvents();
  }, []);

  const handleSearchExecute = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      searchQuery: searchInput,
      filterOwner: ownerInput,
      filterOwnerName: ownerNameInput,
      filterStatus: statusInput,
      filterPoints: pointsInput,
      filterFee: feeInput,
    });
  };

  const handleFilterDropdownChange = (filterName: string, value: string) => {
    if (filterName === "owner") setOwnerInput(value);
    if (filterName === "ownerName") setOwnerNameInput(value);
    if (filterName === "status") setStatusInput(value);
    if (filterName === "points") setPointsInput(value);
    if (filterName === "fee") setFeeInput(value);

    setAppliedFilters((prev) => ({
      ...prev,
      [filterName === "owner" ? "filterOwner" :
       filterName === "ownerName" ? "filterOwnerName" :
       filterName === "status" ? "filterStatus" :
       filterName === "points" ? "filterPoints" : "filterFee"]: value,
    }));
  };

  const clearSearch = () => {
    setSearchInput("");
    setOwnerInput("All");
    setOwnerNameInput("All");
    setStatusInput("All");
    setPointsInput("All");
    setFeeInput("All");
    setAppliedFilters({
      searchQuery: "",
      filterOwner: "All",
      filterOwnerName: "All",
      filterStatus: "All",
      filterPoints: "All",
      filterFee: "All",
    });
  };

  const filteredEvents = events.filter((event) => {
    const { searchQuery, filterOwner, filterOwnerName, filterStatus, filterPoints, filterFee } = appliedFilters;

    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    if (filterOwner !== "All" && event.ownerType !== filterOwner) return false;
    if (filterOwnerName !== "All" && event.ownerName !== filterOwnerName) return false;
    
    if (filterStatus !== "All" && event.status !== filterStatus) return false;

    if (filterPoints !== "All") {
      const wantsPoints = filterPoints === "Yes";
      if (event.activityPoints !== wantsPoints) return false;
    }

    if (filterFee !== "All") {
      const isFree = event.fee === 0 || event.fee === "Free";
      if (filterFee === "Free" && !isFree) return false;
      if (filterFee === "Priced" && isFree) return false;
    }
    return true;
  });

  const processedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
    
    const feeA = a.fee === "Free" ? 0 : Number(a.fee);
    const feeB = b.fee === "Free" ? 0 : Number(b.fee);
    
    if (sortBy === "fee-low") return feeA - feeB;
    if (sortBy === "fee-high") return feeB - feeA;
    return 0;
  });

  const isAnyFilterActive = searchInput || ownerInput !== "All" || ownerNameInput !== "All" || statusInput !== "All" || pointsInput !== "All" || feeInput !== "All";

  const getOwnerNameOptions = () => {
    if (ownerInput === "Society") return societyOptions;
    if (ownerInput === "Club") return clubOptions;
    if (ownerInput === "College") return collegeOptions;
    return [...societyOptions, ...clubOptions, ...collegeOptions];
  };

  if (!isReady) {
    return <UIOverlay />; 
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <UIOverlay />
      <FeaturedCarousel events={events} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <form onSubmit={handleSearchExecute} className="w-full max-w-3xl flex flex-col gap-3 relative">
            <div className="flex gap-3 relative w-full items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by Event Title..."
                  className="w-full pl-12 pr-32 py-3 bg-white border border-gray-400 text-gray-900 rounded-full focus:ring-2 focus:ring-purple-500 outline-none transition-shadow text-sm"
                />
                {isAnyFilterActive && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-[105px] top-3.5 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
                    title="Clear Search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-colors text-xs"
                >
                  Search
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-full border transition-colors flex-shrink-0 ${
                  showFilters
                    ? "bg-purple-100 border-purple-300 text-purple-700"
                    : "bg-white border-gray-400 text-gray-500 hover:bg-gray-50"
                }`}
                title="Advanced Filters"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
            
            {showFilters && (
              <div className="w-full bg-white border border-gray-300 rounded-xl p-4 grid grid-cols-2 md:grid-cols-5 gap-3 animate-fade-in">
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Organizer Type</label>
                  <select
                    value={ownerInput}
                    onChange={(e) => handleFilterDropdownChange("owner", e.target.value)}
                    className="w-full bg-gray-50 border-gray-300 text-gray-700 rounded-lg text-xs p-2 border outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="All">All Types</option>
                    <option value="Society">Societies</option>
                    <option value="Club">Clubs</option>
                    <option value="College">College</option>
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Organizer Name</label>
                  <select
                    value={ownerNameInput}
                    onChange={(e) => handleFilterDropdownChange("ownerName", e.target.value)}
                    className="w-full bg-gray-50 border-gray-300 text-gray-700 rounded-lg text-xs p-2 border outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="All">All Names</option>
                    {getOwnerNameOptions().map((opt, index) => (
                      <option key={index} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => handleFilterDropdownChange("status", e.target.value)}
                    className="w-full bg-gray-50 border-gray-300 text-gray-700 rounded-lg text-xs p-2 border outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Past">Past</option>
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Activity Points</label>
                  <select
                    value={pointsInput}
                    onChange={(e) => handleFilterDropdownChange("points", e.target.value)}
                    className="w-full bg-gray-50 border-gray-300 text-gray-700 rounded-lg text-xs p-2 border outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="All">All</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Entry Fee</label>
                  <select
                    value={feeInput}
                    onChange={(e) => handleFilterDropdownChange("fee", e.target.value)}
                    className="w-full bg-gray-50 border-gray-300 text-gray-700 rounded-lg text-xs p-2 border outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="All">All</option>
                    <option value="Free">Free</option>
                    <option value="Priced">Priced</option>
                  </select>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-purple-600" />
            {processedEvents.length} {processedEvents.length === 1 ? "Event" : "Events"} Found
          </h3>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-purple-200 rounded-lg text-xs bg-purple-50 text-purple-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="fee-low">Fee: Low to High</option>
            <option value="fee-high">Fee: High to Low</option>
          </select>
        </div>

        <div className="events-container">
          {processedEvents.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center flex flex-col items-center shadow-sm">
              <RefreshCw className="w-12 h-12 text-gray-300 mb-3 animate-spin duration-1000" style={{ animationIterationCount: 1 }} />
              <p className="text-gray-500 text-lg font-medium">No events matched your filtering matrix.</p>
              <button
                onClick={clearSearch}
                className="mt-4 text-purple-600 hover:underline font-semibold text-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;