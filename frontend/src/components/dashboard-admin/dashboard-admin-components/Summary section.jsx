/**
 * Admin Dashboard Summary Section
 * Displays key metrics at the top of the admin dashboard:
 * - Properties occupied count
 * - Unread notices/announcements count
 * - Pending maintenance requests and complaints count
 * 
 * This component fetches real-time data from the backend APIs
 * to provide admins with quick overview of important statistics
 */

import { useEffect, useState } from "react";
import { FileExclamationPoint, Bell, X, Clock, CheckCircle, AlertCircle, Trash2, Plus } from "lucide-react";
import { noticesAPI, maintenanceAPI } from "../../../Services/api";

export const Summary = () => {
    // State to hold the summary statistics
    const [stats, setStats] = useState({
        notices: 0,              // Count of all notices/announcements
        requests: 0              // Count of maintenance requests and complaints
    });
    const [loading, setLoading] = useState(true);
    const [allNotices, setAllNotices] = useState([]);
    const [allRequests, setAllRequests] = useState([]);
    const [showNoticesModal, setShowNoticesModal] = useState(false);
    const [showRequestsModal, setShowRequestsModal] = useState(false);
    const [showCreateNoticeModal, setShowCreateNoticeModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [updatingId, setUpdatingId] = useState(null);
    const [noticeFormData, setNoticeFormData] = useState({
        title: '',
        message: '',
        priority: 'normal'
    });

    // Fetch data when component mounts
    useEffect(() => {
        fetchSummaryData();
    }, []);

    /**
     * Fetches data from multiple APIs and calculates summary statistics
     * Runs in parallel for better performance using Promise.all
     */
    const fetchSummaryData = async () => {
        try {
            // Fetch all data in parallel for performance
            const [noticesResponse, maintenanceResponse] = await Promise.all([
                noticesAPI.getAll().catch(() => []),
                maintenanceAPI.getAll().catch(() => [])
            ]);

            // Extract data arrays (handle different response formats)
            const notices = noticesResponse?.data || noticesResponse || [];
            const maintenance = maintenanceResponse?.data || maintenanceResponse || [];

            // Update state with calculated values
            setAllNotices(notices);
            setAllRequests(maintenance);
            setStats({
                notices: notices.length,
                requests: maintenance.length
            });
        } catch (error) {
            console.error('Error fetching summary data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Create new notice
    const handleCreateNotice = async (e) => {
        e.preventDefault();
        setUpdatingId('creating');
        try {
            await noticesAPI.create(noticeFormData);
            // Refresh the data
            await fetchSummaryData();
            // Reset form and close modal
            setNoticeFormData({ title: '', message: '', priority: 'normal' });
            setShowCreateNoticeModal(false);
            alert('Notice created successfully!');
        } catch (error) {
            console.error('Error creating notice:', error);
            alert('Failed to create notice');
        } finally {
            setUpdatingId(null);
        }
    };

    // Delete notice
    const handleDeleteNotice = async (noticeId) => {
        if (!window.confirm('Are you sure you want to delete this notice?')) return;
        
        setUpdatingId(noticeId);
        try {
            await noticesAPI.delete(noticeId);
            // Refresh the data
            await fetchSummaryData();
        } catch (error) {
            console.error('Error deleting notice:', error);
            alert('Failed to delete notice');
        } finally {
            setUpdatingId(null);
        }
    };

    // Update request status
    const handleUpdateStatus = async (requestId, newStatus) => {
        setUpdatingId(requestId);
        try {
            await maintenanceAPI.updateStatus(requestId, newStatus);
            // Refresh the data
            await fetchSummaryData();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    // Filter requests based on selected status
    const filteredRequests = selectedStatus === 'all' 
        ? allRequests 
        : allRequests.filter(req => req.status === selectedStatus);

    // Get status color and icon
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <AlertCircle size={16} />;
            case 'in-progress':
                return <Clock size={16} />;
            case 'completed':
                return <CheckCircle size={16} />;
            default:
                return null;
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

    // Configuration for the summary cards
    const blocks = [
        {
            heading: `Notices (${stats.notices})`,
            icon: <Bell />,
            onClick: () => setShowNoticesModal(true),
            id: 'notices'
        },
        {
            heading: `Requests and Complaints (${stats.requests})`,
            icon: <FileExclamationPoint />,
            onClick: () => setShowRequestsModal(true),
            id: 'requests'
        },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {blocks.map((block) => (
                    <div key={block.id}>
                        <button
                            onClick={block.onClick}
                            className="w-full h-16 bg-white rounded-lg pt-4 pl-4 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] border-2 border-[#e0e0e0] hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer text-left"
                        >
                            <div className="flex gap-3 items-center text-sm sm:text-base">
                                {block.icon}
                                <div className="truncate">
                                    {loading ? "Loading..." : block.heading}
                                </div>
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            {/* Notices Modal */}
            {showNoticesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold">Notices & Announcements</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setShowNoticesModal(false);
                                        setShowCreateNoticeModal(true);
                                    }}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus size={20} />
                                    Create Notice
                                </button>
                                <button
                                    onClick={() => setShowNoticesModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Notices List */}
                        <div className="space-y-4">
                            {allNotices.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No notices posted yet</p>
                            ) : (
                                allNotices.map((notice) => (
                                    <div
                                        key={notice.id}
                                        className={`border-2 rounded-lg p-4 hover:shadow-md transition-shadow ${getPriorityColor(notice.priority)}`}
                                    >
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                            <h4 className="font-bold text-lg flex-1">{notice.title}</h4>
                                            <div className="flex gap-2 items-center">
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    {new Date(notice.created_at).toLocaleDateString()}
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteNotice(notice.id)}
                                                    disabled={updatingId === notice.id}
                                                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                                    title="Delete notice"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-2">{notice.message}</p>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className={`px-2 py-1 rounded ${getPriorityColor(notice.priority)}`}>
                                                {notice.priority.toUpperCase()} Priority
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Notice Modal */}
            {showCreateNoticeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Create New Notice</h3>
                            <button
                                onClick={() => {
                                    setShowCreateNoticeModal(false);
                                    setNoticeFormData({ title: '', message: '', priority: 'normal' });
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateNotice} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    value={noticeFormData.title}
                                    onChange={(e) => setNoticeFormData({ ...noticeFormData, title: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                    placeholder="e.g., Monthly Maintenance Schedule"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Message</label>
                                <textarea
                                    value={noticeFormData.message}
                                    onChange={(e) => setNoticeFormData({ ...noticeFormData, message: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 min-h-[100px]"
                                    required
                                    placeholder="Enter the full notice details..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Priority</label>
                                <select
                                    value={noticeFormData.priority}
                                    onChange={(e) => setNoticeFormData({ ...noticeFormData, priority: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={updatingId === 'creating'}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {updatingId === 'creating' ? 'Creating...' : 'Post Notice'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateNoticeModal(false);
                                        setNoticeFormData({ title: '', message: '', priority: 'normal' });
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Requests Modal */}
            {showRequestsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold">Maintenance Requests & Complaints</h3>
                            <button
                                onClick={() => setShowRequestsModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-2 mb-4 flex-wrap">
                            <button
                                onClick={() => setSelectedStatus('all')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    selectedStatus === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                All ({allRequests.length})
                            </button>
                            <button
                                onClick={() => setSelectedStatus('pending')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    selectedStatus === 'pending'
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                Pending ({allRequests.filter(r => r.status === 'pending').length})
                            </button>
                            <button
                                onClick={() => setSelectedStatus('in-progress')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    selectedStatus === 'in-progress'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                In Progress ({allRequests.filter(r => r.status === 'in-progress').length})
                            </button>
                            <button
                                onClick={() => setSelectedStatus('completed')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    selectedStatus === 'completed'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                Completed ({allRequests.filter(r => r.status === 'completed').length})
                            </button>
                        </div>

                        {/* Requests List */}
                        <div className="space-y-4">
                            {filteredRequests.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No requests found</p>
                            ) : (
                                filteredRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                            <h4 className="font-bold text-lg flex-1">{request.title}</h4>
                                            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm whitespace-nowrap ${getStatusColor(request.status)}`}>
                                                {getStatusIcon(request.status)}
                                                {request.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">{request.description}</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                                            <div>Created: {new Date(request.created_at).toLocaleDateString()}</div>
                                            {request.property_id && <div>Property ID: {request.property_id.substring(0, 8)}...</div>}
                                        </div>

                                        {/* Status Update Buttons */}
                                        {request.status !== 'completed' && (
                                            <div className="flex gap-2 flex-wrap">
                                                {request.status !== 'in-progress' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(request.id, 'in-progress')}
                                                        disabled={updatingId === request.id}
                                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors disabled:opacity-50 text-sm"
                                                    >
                                                        {updatingId === request.id ? 'Updating...' : 'Mark In Progress'}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleUpdateStatus(request.id, 'completed')}
                                                    disabled={updatingId === request.id}
                                                    className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors disabled:opacity-50 text-sm"
                                                >
                                                    {updatingId === request.id ? 'Updating...' : 'Mark Complete'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};