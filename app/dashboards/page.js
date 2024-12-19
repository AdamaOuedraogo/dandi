"use client";
import { useState, useEffect } from "react";
import {
  EyeIcon,
  ClipboardIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import DashboardLayout from "../components/DashboardLayout";

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showKey, setShowKey] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success", // success, error, info
  });

  const fetchApiKeys = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/keys");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch");
      }
      const data = await response.json();
      setApiKeys(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching keys:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createApiKey = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("keyName"),
          limit: formData.get("limitValue"),
        }),
      });

      if (!response.ok) throw new Error("Failed to create");
      const newKey = await response.json();
      setApiKeys([...apiKeys, newKey]);
      setIsModalOpen(false);
      showNotification("API Key created successfully", "success");
    } catch (err) {
      showNotification("Failed to create API key", "error");
    }
  };

  const deleteApiKey = async (keyId) => {
    if (!confirm("Are you sure you want to delete this API key?")) return;

    try {
      const response = await fetch(`/api/keys?id=${keyId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");
      setApiKeys(apiKeys.filter((key) => key.id !== keyId));
      showNotification("API Key deleted successfully", "success");
    } catch (err) {
      showNotification("Failed to delete API key", "error");
    }
  };

  const copyToClipboard = async (key) => {
    try {
      await navigator.clipboard.writeText(key);
      showNotification("Copied API Key to clipboard", "success");
    } catch (err) {
      showNotification("Failed to copy to clipboard", "error");
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  useEffect(() => {
    console.log("Modal state:", isModalOpen);
  }, [isModalOpen]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Overview</h1>

        {/* Current Plan Section */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-8 mb-12 text-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-sm font-medium mb-2">CURRENT PLAN</div>
              <h2 className="text-4xl font-bold mb-6">Researcher</h2>
              <div className="space-y-2">
                <div className="text-sm font-medium">API Limit</div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white h-full rounded-full"
                    style={{ width: "2.4%" }}
                  ></div>
                </div>
                <div className="text-sm">24 / 1,000 Requests</div>
              </div>
            </div>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm">
              Manage Plan
            </button>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">API Keys</h2>
            <button
              type="button"
              onClick={() => {
                console.log("Opening modal...");
                setIsModalOpen(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Create New Key
            </button>
          </div>
          <p className="text-gray-600 mb-8">
            The key is used to authenticate your requests to the Research API.
            To learn more, see the documentation page.
          </p>

          {/* API Keys Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="grid grid-cols-4 gap-4 p-4 border-b text-gray-500 text-sm">
              <div>NAME</div>
              <div>USAGE</div>
              <div>KEY</div>
              <div>OPTIONS</div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : apiKeys.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No API keys found. Create one to get started.
              </div>
            ) : (
              apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="grid grid-cols-4 gap-4 p-4 border-b items-center hover:bg-gray-50"
                >
                  <div>{key.name}</div>
                  <div>{key.usage || 0}</div>
                  <div className="font-mono text-sm flex items-center gap-2">
                    {showKey[key.id]
                      ? key.key
                      : "dandi-••••••••••••••••••••••••••"}
                    <button
                      onClick={() =>
                        setShowKey((prev) => ({
                          ...prev,
                          [key.id]: !prev[key.id],
                        }))
                      }
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <EyeIcon className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(key.key)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ClipboardIcon className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <PencilIcon className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => deleteApiKey(key.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <TrashIcon className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create API Key Modal */}
        <div
          className={`fixed inset-0 ${
            isModalOpen ? "flex" : "hidden"
          } bg-black/50 items-center justify-center z-50`}
        >
          <div
            className="bg-white rounded-xl w-full max-w-lg mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">
                Create a new API key
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Enter a name and limit for the new API key.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createApiKey(e);
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-[15px] text-gray-700 mb-2">
                    Key Name — A unique name to identify this key
                  </label>
                  <input
                    type="text"
                    name="keyName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[15px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Key Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[15px] text-gray-700 mb-2">
                    Limit monthly usage*
                  </label>
                  <input
                    type="number"
                    name="limitValue"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[15px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={1000}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    * If the combined usage of all your keys exceeds your plan's
                    limit, all requests will be rejected.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed bottom-4 left-4 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg animate-fade-in ${
              notification.type === "success"
                ? "bg-gray-900 text-white"
                : notification.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {notification.type === "success" && (
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            )}
            {notification.type === "error" && (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            )}
            <span>{notification.message}</span>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
