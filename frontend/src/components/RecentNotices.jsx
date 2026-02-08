import { useEffect, useState } from "react";
import { Bell, Calendar, Clock } from "lucide-react";
import { eventsAPI } from "../Services/api";

export const RecentNotices = ({ title = "Recent Notices", limit = 5 }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchNotices = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await eventsAPI.getAll();
        const events = data?.data ?? data ?? [];

        const sorted = [...events].sort((a, b) => {
          const aDate = new Date(a.date || 0).getTime();
          const bDate = new Date(b.date || 0).getTime();
          return bDate - aDate;
        });

        const filtered = sorted.filter((event) => {
          const type = (event.type || "").toLowerCase();
          return type === "meeting" || event.created_by === "tenant";
        });

        if (isMounted) {
          setNotices(filtered.slice(0, limit));
        }
      } catch (err) {
        if (isMounted) {
          setError("Unable to load notices.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNotices();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return (
    <div className="mt-6">
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-lg font-semibold mb-3">
          <Bell className="size-5 text-blue-600" />
          <span>{title}</span>
        </div>

        {loading && <div className="text-sm text-gray-500">Loading...</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {!loading && !error && notices.length === 0 && (
          <div className="text-sm text-gray-500">No notices yet.</div>
        )}

        <div className="space-y-3">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition"
            >
              <div className="font-medium text-gray-900">{notice.title}</div>
              {notice.description && (
                <div className="text-sm text-gray-600 mt-1">
                  {notice.description}
                </div>
              )}
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {notice.date
                    ? new Date(notice.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "No date"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {notice.time || "--:--"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
