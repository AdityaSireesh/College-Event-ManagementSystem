import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import Addons from "./Addons";

export default function SocHandle() {
  const { setIsLoading, showFlash, triggerConfirm, UIOverlay } = Addons();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); 
  const [type, setType] = useState("S");
  const [searchQuery, setSearchQuery] = useState("");

  const [accounts, setAccounts] = useState<any[]>([]);

  const societyOptions = ["IEEE", "ISTE", "IEDC", "CSI", "IET"];
  const clubOptions = ["Chess Club", "Raagam", "OpenLabs AI Club", "Nature Club"];

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/users/SoC');
      setAccounts(response.data);
    }
    catch (error) {
      console.error("Failed to fetch SoC users", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name === "" || username === "" || email === "") {
      showFlash("Fill all fields!", 'error');
      return;
    }

    setIsLoading(true);

    try {
      const category = type === "S" ? "Society" : "Club";
      const response = await axios.post('http://localhost:3000/auth/register', {
        name: name,
        username: username,
        email: email,
        category: category,
        role: 'SoC'
      });

      showFlash(response.data.msg, 'success');
      setName("");
      setUsername("");
      setEmail("");

      fetchAccounts();
    }
    catch (error: any) {
      showFlash(error.response?.data?.msg || "Error connecting to server", 'error');
    }
    finally {
      setIsLoading(false);
    }
  };

  const executeDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:3000/auth/delete/${id}/SoC`);
      showFlash("Account deleted successfully!", 'success');
      fetchAccounts(); 
    }
    catch (error: any) {
      showFlash(error.response?.data?.msg || "Error deleting account", 'error');
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    triggerConfirm(
      "Delete SoC Account",
      "Are you sure you want to permanently delete this account? This action cannot be undone.",
      () => executeDelete(id)
    );
  };

  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <UIOverlay />
      <form
        onSubmit={handleAdd}
        className="w-full bg-white p-6 border border-gray-200 rounded-xl shadow-sm mb-8 flex flex-col gap-5 text-sm text-gray-700 font-medium"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-3 flex flex-col gap-1.5">
              <label htmlFor="socName">Name of Society/Club:</label>
              <input
                id="socName"
                type="text"
                list="societyClubList"
                placeholder="Select or Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 w-full"
              />
              <datalist id="societyClubList">
                {(type === "S" ? societyOptions : clubOptions).map((item, index) => (
                  <option key={index} value={item} />
                ))}
              </datalist>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-gray-600 font-semibold">Type:</span>
            <div className="flex border border-gray-300 rounded-md overflow-hidden bg-gray-50 w-full">
              <button
                type="button"
                onClick={() => setType("S")}
                className={`flex-1 py-2 font-bold transition-colors text-center ${
                  type === "S" ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Society
              </button>
              <button
                type="button"
                onClick={() => setType("C")}
                className={`flex-1 py-2 font-bold transition-colors text-center ${
                  type === "C" ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Club
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end pt-2 border-t border-gray-100">
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label htmlFor="socUser">Username:</label>
            <input
              id="socUser"
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 w-full"
            />
          </div>

          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label htmlFor="socEmail">Email Address:</label>
            <input
              id="socEmail"
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 w-full"
            />
          </div>

          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 shadow-sm transition-colors text-center"
            >
              ADD
            </button>
          </div>
        </div>
      </form>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search Societies/Clubs by name" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700 shadow-sm text-sm"
        />
      </div>

      <div className="w-full overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm">
        <table className="table-fixed w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple-100 text-gray-700 text-sm font-semibold">
              <th className="p-4 text-center w-20 rounded-l-xl">S/C</th>
              <th className="p-4 w-48">Name of Society/Club</th>
              <th className="p-4 w-38">Username</th>
              <th className="p-4 w-48">Email</th> 
              <th className="p-4 text-center w-28 rounded-r-xl">Action</th>
            </tr>
          </thead>

          <tbody className="text-gray-600 text-sm divide-y divide-gray-100">
            {filteredAccounts.map((acc) => (
              <tr key={acc._id} className="hover:bg-gray-50/70 transition-colors">
                <td className="p-4 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                      acc.category === "Society" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {acc.category === "Society" ? "S" : "C"}
                  </span>
                </td>
                <td className="p-4 font-medium text-gray-800 break-words">{acc.name}</td>
                <td className="p-4 font-mono text-xs text-gray-500 break-all">{acc.username}</td>
                <td className="p-4 text-xs text-gray-500 break-all">{acc.email}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleDelete(acc._id)}
                    className="inline-flex items-center px-3 py-1 bg-red-400 text-black rounded-lg border transition-all duration-200 hover:bg-red-500 hover:scale-110 hover:shadow-md active:scale-95"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredAccounts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">No clubs or societies found matching your search</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}