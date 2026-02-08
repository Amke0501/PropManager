import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Home, Clock } from "lucide-react";
import { eventsAPI } from "../../../Services/api";

export const UpcomingActivity = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

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

    const upcomingEvents = events.filter((event) => event.status !== 'completed');
    const pastEvents = events.filter((event) => event.status === 'completed');

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

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
        <div className="mt-6 sm:mt-10">
            <div className="w-full border-2 transition-all duration-200 hover:shadow-lg border-gray-200 bg-white rounded-2xl px-4 py-4 flex flex-col lg:flex-row gap-4">
                {/* Calendar Section */}
                <div className="flex-1 flex flex-col">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className="flex gap-2">
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

  if (loading) return <div>Loading events...</div>;

  return (
    <div className="mt-16">
      <div className="calender-wrap aspect-video border-2 transition-all duration-200 hover:shadow-lg border-gray-200 bg-white rounded-2xl px-4 py-1 flex gap-4 relative">
        {/* Calendar Section - Hidden on mobile when overlay is shown */}
        <div
          className={`flex-1 flex flex-col ${showEventsOverlay ? "hidden lg:flex" : "flex"}`}
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
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
                  onClick={() => handleDateClick(day)}
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

        {/* Events Sidebar*/}
        <div
          className={`
            flex-1 border-gray-200 lg:border-l lg:pl-4 flex flex-col pt-3
            ${
              showEventsOverlay
                ? ""
                : "hidden show-side-event"
            }
          `}
        >
          {/* Back button - Only visible on mobile when overlay is shown */}
          {showEventsOverlay && (
            <button
              onClick={handleBackToCalendar}
              className="lg:hidden flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="size-5" />
              <span className="font-medium">Back to Calendar</span>
            </button>
          )}

                {/* Events Sidebar */}
                <div className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-3 lg:pl-4 flex flex-col">
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                            {selectedDate
                                ? `Events for ${monthNames[currentDate.getMonth()]} ${selectedDate}`
                                : activeTab === 'past' ? "Past Events" : "Your Appointments"}
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
                                className={`p-3 rounded-lg border ${getEventTypeColor(event.type)} transition-all hover:shadow-md`}
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
                                        {event.description && (
                                            <p className="text-xs mt-1 opacity-70">
                                                {event.description}
                                            </p>
                                        )}
                                        {event.status && (
                                            <p className="text-xs mt-1 font-medium">
                                                Status: {event.status === 'completed' ? 'closed' : event.status}
                                            </p>
                                        )}
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
                                {event.status === 'pending' && (
                                    <div className="mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                        Pending Admin Review
                                    </div>
                                )}
                                {event.status === 'confirmed' && (
                                    <div className="mt-2 text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                                        Confirmed by Admin
                                    </div>
                                )}
                                {event.status === 'completed' && (
                                    <div className="mt-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                        Closed
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
                {event.created_by === "tenant" && (
                  <div className="mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    Your Request - Pending Admin Review
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
    </div>
  );
};
