"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Feedback {
  id: number;
  feedbackId: string;
  name: string | null;
  contact: string | null;
  diningTime: string | null;
  rating: number;
  content: string;
  status: string;
  response: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ status: "", response: "" });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("/api/admin/feedback");
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
      } else {
        setError("Failed to fetch feedback");
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setError("An error occurred while fetching feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleEdit = (feedback: Feedback) => {
    setEditingId(feedback.id);
    setEditData({
      status: feedback.status,
      response: feedback.response || "",
    });
  };

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/feedback/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        setEditingId(null);
        await fetchFeedbacks();
      } else {
        setError("Failed to update feedback");
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
      setError("An error occurred while updating feedback");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({ status: "", response: "" });
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    if (filter === "all") return true;
    return feedback.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      unprocessed: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      processed: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              All ({feedbacks.length})
            </button>
            <button
              onClick={() => setFilter("unprocessed")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === "unprocessed"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Unprocessed ({feedbacks.filter(f => f.status === "unprocessed").length})
            </button>
            <button
              onClick={() => setFilter("processing")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === "processing"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Processing ({feedbacks.filter(f => f.status === "processing").length})
            </button>
            <button
              onClick={() => setFilter("processed")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === "processed"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Processed ({feedbacks.filter(f => f.status === "processed").length})
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredFeedbacks.map((feedback) => (
              <li key={feedback.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          {getRatingStars(feedback.rating)}
                          <span className="ml-2 text-sm text-gray-600">
                            ({feedback.rating}/5)
                          </span>
                        </div>
                        {getStatusBadge(feedback.status)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="font-medium text-gray-700">ID:</span>
                        <span className="ml-2 font-mono text-xs">{feedback.feedbackId}</span>
                      </div>
                      {feedback.name && (
                        <div>
                          <span className="font-medium text-gray-700">Name:</span>
                          <span className="ml-2">{feedback.name}</span>
                        </div>
                      )}
                      {feedback.contact && (
                        <div>
                          <span className="font-medium text-gray-700">Contact:</span>
                          <span className="ml-2">{feedback.contact}</span>
                        </div>
                      )}
                      {feedback.diningTime && (
                        <div>
                          <span className="font-medium text-gray-700">Dining Time:</span>
                          <span className="ml-2">
                            {new Date(feedback.diningTime).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <span className="font-medium text-gray-700">Feedback:</span>
                      <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                        {feedback.content}
                      </p>
                    </div>

                    {editingId === feedback.id ? (
                      <div className="space-y-4 border-t pt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            value={editData.status}
                            onChange={(e) =>
                              setEditData({ ...editData, status: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="unprocessed">Unprocessed</option>
                            <option value="processing">Processing</option>
                            <option value="processed">Processed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Response
                          </label>
                          <textarea
                            value={editData.response}
                            onChange={(e) =>
                              setEditData({ ...editData, response: e.target.value })
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your response to the customer..."
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSave(feedback.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-t pt-4">
                        {feedback.response ? (
                          <div className="mb-3">
                            <span className="font-medium text-gray-700">Response:</span>
                            <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                              {feedback.response}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic mb-3">No response yet</p>
                        )}
                        <button
                          onClick={() => handleEdit(feedback)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {filteredFeedbacks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No feedback found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}