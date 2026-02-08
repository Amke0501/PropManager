/**
 * User/Tenant Dashboard Summary Section
 * Displays key information for tenants at the top of their dashboard:
 * - Payment due date reminder
 * - Unread notices count
 * - Active alerts/notifications count
 * 
 * This component fetches real-time data from backend APIs to keep
 * tenants informed of important updates
 */

import { useEffect, useState } from "react";
import { BanknoteArrowDownIcon, FileExclamationPoint, Bell, X, CheckCircle } from "lucide-react";
import { paymentsAPI, noticesAPI, maintenanceAPI } from "../../../Services/api";

export const Summary = () => {
    // State to hold summary statistics for tenant dashboard
    const [stats, setStats] = useState({
        paymentDueDate: "No payments due",  // Next payment due date or status
        noticeCount: 0,                      // Count of notices
        unreadNoticeCount: 0,                // Count of unread notices
        alertCount: 0                        // Count of active maintenance requests/alerts
    });
    const [loading, setLoading] = useState(true);
    const [allNotices, setAllNotices] = useState([]);
    const [readNoticeIds, setReadNoticeIds] = useState([]);
    const [showNoticesModal, setShowNoticesModal] = useState(false);
    const [markingAsRead, setMarkingAsRead] = useState(null);

    // Fetch data when component mounts
    useEffect(() => {
        fetchSummaryData();
    }, []);

    /**
     * Fetches tenant-specific data from multiple APIs
     * - Payments: To determine next due date
     * - Notices: To show unread/total notice count
     * - Maintenance: To show active requests as alerts
     */
    const fetchSummaryData = async () => {
        try {
            // Fetch all relevant data in parallel
            const [paymentsResponse, noticesResponse, maintenanceResponse, readStatusResponse] = await Promise.all([
                paymentsAPI.getAll().catch(() => []),
                noticesAPI.getAll().catch(() => []),
                maintenanceAPI.getAll().catch(() => []),
                noticesAPI.getReadStatus().catch(() => [])
            ]);

            // Extract data arrays (handle different response formats)
            const payments = paymentsResponse?.data || paymentsResponse || [];
            const notices = noticesResponse?.data || noticesResponse || [];
            const maintenance = maintenanceResponse?.data || maintenanceResponse || [];
            const readIds = readStatusResponse?.data || readStatusResponse || [];

            // TODO: Calculate next payment due date from payments data
            // For now showing count of payments made
            const paymentStatus = payments.length > 0 
                ? `${payments.length} payments recorded` 
                : "No payment history";

            // Count active/pending maintenance requests as alerts
            const activeAlerts = maintenance.filter(m => 
                m.status === 'pending' || m.status === 'in-progress'
            ).length;

            // Calculate unread notices
            const unreadCount = notices.filter(n => !readIds.includes(n.id)).length;

            // Update state with calculated values
            setAllNotices(notices);
            setReadNoticeIds(readIds);
            setStats({
                paymentDueDate: paymentStatus,
                noticeCount: notices.length,
                unreadNoticeCount: unreadCount,
                alertCount: activeAlerts
            });
        } catch (error) {
            console.error('Error fetching tenant summary data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mark notice as read
    const handleMarkAsRead = async (noticeId) => {
        if (readNoticeIds.includes(noticeId)) return; // Already read
        
        setMarkingAsRead(noticeId);
        try {
            await noticesAPI.markAsRead(noticeId);
            // Refresh the data
            await fetchSummaryData();
        } catch (error) {
            console.error('Error marking notice as read:', error);
        } finally {
            setMarkingAsRead(null);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'normal':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    // Configuration for the three summary cards
    const blocks = [
        {
            heading: loading ? "Loading..." : stats.paymentDueDate,
            icon: <BanknoteArrowDownIcon />,
            id: 'payments'
        },
        {
            heading: loading ? "Loading..." : `Notices (${stats.unreadNoticeCount} unread)`,
            icon: <Bell />,
            onClick: () => setShowNoticesModal(true),
            id: 'notices',
            hasUnread: stats.unreadNoticeCount > 0
        },
        {
            heading: loading ? "Loading..." : `Alerts (${stats.alertCount})`,
            icon: <FileExclamationPoint />,
            id: 'alerts'
        },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {blocks.map((block) => (
                    <div key={block.id}>
                        {block.onClick ? (
                            <button
                                onClick={block.onClick}
                                className={`w-full h-16 bg-white rounded-lg pt-4 pl-4 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] border-2 transition-all text-left ${
                                    block.hasUnread 
                                        ? 'border-blue-500 hover:border-blue-600' 
                                        : 'border-[#e0e0e0] hover:border-blue-400'
                                }`}
                            >
                                <div className="flex gap-3 items-center text-sm sm:text-base">
                                    {block.icon}
                                    <div className="truncate">
                                        {block.heading}
                                    </div>
                                </div>
                            </button>
                        ) : (
                            <div className="w-full h-16 bg-white rounded-lg pt-4 pl-4 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] border-2 border-[#e0e0e0]">
                                <div className="flex gap-3 items-center text-sm sm:text-base">
                                    {block.icon}
                                    <div className="truncate">
                                        {block.heading}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Notices Modal */}
            {showNoticesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold">Notices & Announcements</h3>
                            <button
                                onClick={() => setShowNoticesModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Notices List */}
                        <div className="space-y-4">
                            {allNotices.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No notices available</p>
                            ) : (
                                allNotices.map((notice) => {
                                    const isRead = readNoticeIds.includes(notice.id);
                                    return (
                                        <div
                                            key={notice.id}
                                            className={`border-2 rounded-lg p-4 transition-all ${
                                                isRead 
                                                    ? 'bg-gray-50 border-gray-200' 
                                                    : `${getPriorityColor(notice.priority)} shadow-md`
                                            }`}
                                        >
                                            <div className="flex justify-between items-start gap-4 mb-2">
                                                <h4 className="font-bold text-lg flex-1">{notice.title}</h4>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                                        {new Date(notice.created_at).toLocaleDateString()}
                                                    </span>
                                                    {!isRead && (
                                                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                                            NEW
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-700 mb-3 whitespace-pre-wrap">{notice.message}</p>
                                            <div className="flex justify-between items-center">
                                                <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(notice.priority)}`}>
                                                    {notice.priority.toUpperCase()} Priority
                                                </span>
                                                {!isRead && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notice.id)}
                                                        disabled={markingAsRead === notice.id}
                                                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors disabled:opacity-50 text-sm"
                                                    >
                                                        <CheckCircle size={14} />
                                                        {markingAsRead === notice.id ? 'Marking...' : 'Mark as Read'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};