// src/components/BookNowModal.jsx
import React from "react";

const BookNowModal = ({ isOpen, onClose, onSubmit, eventDate, setEventDate, eventLocation, setEventLocation }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-purple-700">Book Your Service</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Date</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
              className="border rounded px-4 py-2 mt-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Event Location</label>
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              required
              placeholder="Enter event address"
              className="border rounded px-4 py-2 mt-1 w-full"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 transition"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookNowModal;
