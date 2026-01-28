import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Home, Clock, Users } from "lucide-react";

export const UpcomingActivity = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Sample events data
  const events = [
    {
      id: 1,
      date: new Date(2026, 0, 28),
      title: "Property Inspection",
      property: "123 Main St",
      type: "inspection",
      time: "10:00 AM",
    },
    {
      id: 2,
      date: new Date(2026, 0, 28),
      title: "Lease Signing",
      property: "456 Oak Ave",
      type: "lease",
      time: "2:00 PM",
    },
    {
      id: 3,
      date: new Date(2026, 0, 30),
      title: "Maintenance Check",
      property: "789 Pine Rd",
      type: "maintenance",
      time: "9:00 AM",
    },
    {
      id: 4,
      date: new Date(2026, 1, 2),
      title: "Tenant Meeting",
      property: "321 Elm St",
      type: "meeting",
      time: "3:00 PM",
    },
    {
      id: 5,
      date: new Date(2026, 1, 5),
      title: "Rent Collection",
      property: "654 Maple Dr",
      type: "payment",
      time: "11:00 AM",
    },
  ];

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
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="mt-6">
      <div className="w-[740px] h-[480px] border-2 transition-all duration-200 hover:shadow-lg border-gray-200 bg-white rounded-2xl px-4 py-1 flex gap-4">
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
        <div className="w-64 border-l border-gray-200 pl-4 flex flex-col pt-3">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {selectedDate
                ? `Events for ${monthNames[currentDate.getMonth()]} ${selectedDate}`
                : "Upcoming Events"}
            </h3>
            <p className="text-xs text-gray-500">
              {selectedDate ? getEventsForSelectedDate().length : events.length}{" "}
              event(s)
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {(selectedDate
              ? getEventsForSelectedDate()
              : events.slice(0, 5)
            ).map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border ${getEventTypeColor(event.type)} transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <Home className="size-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">
                      {event.title}
                    </h4>
                    <p className="text-xs truncate opacity-80">
                      {event.property}
                    </p>
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
