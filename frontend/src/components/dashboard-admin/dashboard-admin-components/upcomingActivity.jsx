import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Home, Clock, Plus, Pencil, Trash2, X } from "lucide-react";
import { eventsAPI } from "../../../Services/api";

export const UpcomingActivity = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [formData, setFormData] = useState({
        title: '',
        property: '',
        type: 'inspection',
        date: '',
        time: ''
    });

    useEffect(() => {
        fetchEvents();
        const intervalId = setInterval(fetchEvents, 30000);
        return () => clearInterval(intervalId);
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await eventsAPI.getAll();
            // Convert date strings to Date objects
            const formattedEvents = (data?.data ?? data ?? []).map(event => ({
                ...event,
                date: new Date(event.date)
            }));
            setEvents(formattedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const eventData = {
                ...formData,
                date: formData.date
            };

            if (editingEvent) {
                await eventsAPI.update(editingEvent.id, eventData);
            } else {
                await eventsAPI.create(eventData);
            }

            fetchEvents();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Failed to save event');
        }
    };

    const handleDelete = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await eventsAPI.delete(eventId);
                fetchEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event');
            }
        }
    };

    const handleConfirm = async (eventId) => {
        try {
            await eventsAPI.confirm(eventId);
            fetchEvents();
        } catch (error) {
            console.error('Error confirming event:', error);
            alert('Failed to confirm notice');
        }
    };

    const handleComplete = async (eventId) => {
        try {
            await eventsAPI.complete(eventId);
            fetchEvents();
        } catch (error) {
            console.error('Error completing event:', error);
            alert('Failed to complete notice');
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            property: event.property,
            type: event.type,
            date: event.date.toISOString().split('T')[0],
            time: event.time
        });
        setShowModal(true);
    };

    const handleAddEvent = () => {
        const dateToUse = selectedDate
            ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate)
            : new Date();

        setFormData({
            title: '',
            property: '',
            type: 'inspection',
            date: dateToUse.toISOString().split('T')[0],
            time: '09:00'
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingEvent(null);
        setFormData({
            title: '',
            property: '',
            type: 'inspection',
            date: '',
            time: ''
        });
    };

    const getEventTypeColor = (type) => {
        const colors = {
            inspection: "bg-blue-100 text-blue-800 border-blue-200",
            lease: "bg-green-100 text-green-800 border-green-200",
            maintenance: "bg-orange-100 text-orange-800 border-orange-200",
            meeting: "bg-purple-100 text-purple-800 border-purple-200",
            payment: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
        return colors[type] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

    const prevMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
        );
    };

    const nextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
        );
    };

    const getEventsForDate = (day) => {
        const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );
        return events.filter(
            (event) =>
                event.date.getDate() === date.getDate() &&
                event.date.getMonth() === date.getMonth() &&
                event.date.getFullYear() === date.getFullYear()
        );
    };
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const upcomingEvents = events.filter((event) => event.status !== 'completed');
    const pastEvents = events.filter((event) => event.status === 'completed');

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const getEventsForDate = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    );
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    return getEventsForDate(selectedDate);
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    // Show overlay only on medium and lower devices
    if (window.innerWidth < 1024) {
      setShowEventsOverlay(true);
    }
  };

  const handleBackToCalendar = () => {
    setShowEventsOverlay(false);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isToday = (day) => {
    const today = new Date();
    return (
        <div className="mt-6">
            <div className="w-full border-2 transition-all duration-200 hover:shadow-lg border-gray-200 bg-white rounded-2xl px-4 py-4 flex flex-col lg:flex-row gap-4 relative">
                {/* Calendar Section */}
                <div className="flex-1 flex flex-col relative z-0">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddEvent}
                                className="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                                title="Add Event"
                            >
                                <Plus className="size-5" />
                            </button>
                            <button
                                onClick={prevMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                            <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronRight className="size-5" />
                            </button>
                        </div>
                    </div>

                    {/* Day Names */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map((day) => (
                            <div
                                key={day}
                                className="text-center text-xs font-semibold text-gray-600 py-2"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 flex-1">
                        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                            <div key={`empty-${index}`} className=""></div>
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, index) => {
                            const day = index + 1;
                            const dayEvents = getEventsForDate(day);
                            const hasEvents = dayEvents.length > 0;
                            const isTodayDate = isToday(day);
                            const isSelected = selectedDate === day;

                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDate(day)}
                                    className={`
                    relative p-2 text-sm rounded-lg transition-all
                    ${isTodayDate ? "bg-blue-50 font-bold text-blue-600" : "text-gray-700"}
                    ${isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-100"}
                  `}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span>{day}</span>
                    {hasEvents && (
                      <div className="flex gap-0.5 mt-1">
                        {dayEvents.slice(0, 3).map((event, i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 rounded-full ${
                              event.type === "inspection"
                                ? "bg-blue-500"
                                : event.type === "lease"
                                  ? "bg-green-500"
                                  : event.type === "maintenance"
                                    ? "bg-orange-500"
                                    : event.type === "meeting"
                                      ? "bg-purple-500"
                                      : "bg-emerald-500"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

                {/* Events Sidebar */}
                <div className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-3 lg:pl-4 flex flex-col relative z-10 pointer-events-auto">
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                            {selectedDate
                                ? `Events for ${monthNames[currentDate.getMonth()]} ${selectedDate}`
                                : activeTab === 'past' ? "Past Events" : "Upcoming Events"}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {selectedDate
                                ? getEventsForSelectedDate().length
                                : activeTab === 'past'
                                    ? pastEvents.length
                                    : upcomingEvents.length}{" "}
                            event(s)
                        </p>
                        {!selectedDate && (
                            <div className="mt-2 flex gap-2 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('upcoming')}
                                    className={`px-2 py-1 rounded ${
                                        activeTab === 'upcoming'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Upcoming
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('past')}
                                    className={`px-2 py-1 rounded ${
                                        activeTab === 'past'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Past
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3">
                        {(selectedDate
                            ? getEventsForSelectedDate()
                            : (activeTab === 'past' ? pastEvents : upcomingEvents).slice(0, 5)
                        ).map((event) => (
                            <div
                                key={event.id}
                                className={`relative p-3 rounded-lg border ${getEventTypeColor(event.type)} transition-all hover:shadow-md group pointer-events-auto`}
                            >
                                <div className="flex items-start gap-2 mb-2">
                                    <Home className="size-4 mt-0.5 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm truncate">
                                            {event.title}
                                        </h4>
                                        <p className="text-xs truncate opacity-80">
                                            {event.property}
                                        </p>
                                        {event.status && (
                                            <p className="text-xs mt-1 font-medium">
                                                Status: {event.status}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(event)}
                                            className="p-1 hover:bg-white rounded"
                                            title="Edit"
                                        >
                                            <Pencil className="size-3" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            className="p-1 hover:bg-white rounded"
                                            title="Delete"
                                        >
                                            <Trash2 className="size-3" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Clock className="size-3" />
                                    <span>
                    {event.date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                                    <span className="ml-auto">{event.time}</span>
                                </div>
                                {event.created_by !== 'admin' && event.status !== 'completed' && (
                                    <div className="mt-2 flex gap-2 relative z-50" style={{pointerEvents: 'auto'}}>
                                        {event.status !== 'confirmed' && event.status !== 'completed' && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    console.log('Confirm clicked for event:', event.id);
                                                    handleConfirm(event.id);
                                                }}
                                                className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer"
                                                style={{pointerEvents: 'auto', position: 'relative', zIndex: 100}}
                                            >
                                                Confirm
                                            </button>
                                        )}
                                        {event.status !== 'completed' && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    console.log('Mark Done clicked for event:', event.id);
                                                    handleComplete(event.id);
                                                }}
                                                className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                                                style={{pointerEvents: 'auto', position: 'relative', zIndex: 100}}
                                            >
                                                Mark Done
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {selectedDate && getEventsForSelectedDate().length === 0 && (
                            <div className="text-center py-8 text-gray-400">
                                <Clock className="size-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No events scheduled</p>
                            </div>
                        )}
                    </div>
                </div>
              </div>
            ))}

            {selectedDate && getEventsForSelectedDate().length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Clock className="size-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No events scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingEvent ? "Edit Event" : "Add New Event"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Property
                </label>
                <input
                  type="text"
                  value={formData.property}
                  onChange={(e) =>
                    setFormData({ ...formData, property: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="inspection">Inspection</option>
                  <option value="lease">Lease Signing</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="meeting">Meeting</option>
                  <option value="payment">Payment</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  {editingEvent ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
