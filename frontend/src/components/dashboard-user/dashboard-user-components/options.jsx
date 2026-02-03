import { useState } from 'react';
import { X } from 'lucide-react';
import { maintenanceAPI, eventsAPI } from '../../../services/api';

export const Options = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        property: '',
        date: '',
        time: '09:00',
        type: 'meeting'
    });

    const handleOptionClick = (type) => {
        setModalType(type);
        setShowModal(true);

        // Reset form with appropriate defaults
        setFormData({
            title: '',
            description: '',
            property: '',
            date: new Date().toISOString().split('T')[0],
            time: '09:00',
            type: type === 'notice' ? 'meeting' : type === 'maintenance' ? 'maintenance' : 'meeting'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            switch(modalType) {
                case 'notice':
                    // Submit notice as calendar event
                    await eventsAPI.create({
                        title: formData.title,
                        property: formData.property,
                        type: 'meeting',
                        date: formData.date,
                        time: formData.time,
                        description: formData.description
                    });
                    alert('Notice submitted successfully! It has been added to the calendar.');
                    break;

                case 'maintenance':
                    // Submit maintenance request (both to maintenance table and calendar)
                    await maintenanceAPI.create({
                        title: formData.title,
                        description: formData.description,
                        property_id: formData.property
                    });

                    // Also add to calendar
                    await eventsAPI.create({
                        title: `Maintenance: ${formData.title}`,
                        property: formData.property,
                        type: 'maintenance',
                        date: formData.date,
                        time: formData.time,
                        description: formData.description
                    });

                    alert('Maintenance request submitted successfully! It has been added to the calendar.');
                    break;

                case 'payment':
                    // Handle payment
                    console.log('Processing payment:', formData);
                    alert('Payment processed successfully!');
                    break;

                case 'balance':
                    // Show balance info
                    console.log('Checking balance');
                    break;

                default:
                    break;
            }

            setShowModal(false);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit request. Please try again.');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalType('');
    };

    const Opts = [
        {
            button: "Submit Notice",
            action: () => handleOptionClick('notice'),
        },
        {
            button: "Maintenance Request",
            action: () => handleOptionClick('maintenance'),
        },
        {
            button: "Payments",
            action: () => handleOptionClick('payment'),
        },
        {
            button: "Outstanding Balance",
            action: () => handleOptionClick('balance'),
        },
    ];

    const renderModalContent = () => {
        switch(modalType) {
            case 'notice':
                return (
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Submit Notice</h3>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Notice Type
                            </label>
                            <select
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            >
                                <option value="">Select type...</option>
                                <option value="Move Out Notice">Move Out Notice</option>
                                <option value="Inspection Request">Inspection Request</option>
                                <option value="Meeting Request">Meeting Request</option>
                                <option value="Complaint">Complaint</option>
                                <option value="Other Notice">Other Notice</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Property/Unit
                            </label>
                            <input
                                type="text"
                                value={formData.property}
                                onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                placeholder="Your unit number"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Preferred Date
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Preferred Time
                            </label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Details
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 h-32"
                                placeholder="Provide details about your notice..."
                                required
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="flex-1 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                Submit Notice
                            </button>
                        </div>
                    </form>
                );

            case 'maintenance':
                return (
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Maintenance Request</h3>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Issue Title
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                placeholder="e.g., Leaking Faucet"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Property/Unit
                            </label>
                            <input
                                type="text"
                                value={formData.property}
                                onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                placeholder="Your unit number"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Preferred Date for Service
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Preferred Time
                            </label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 h-32"
                                placeholder="Describe the issue in detail..."
                                required
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="flex-1 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                Submit Request
                            </button>
                        </div>
                    </form>
                );

            case 'payment':
                return (
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Make a Payment</h3>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Current Balance: <span className="font-bold text-lg">R5,500</span>
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="Enter amount"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Payment Method
                                </label>
                                <select className="w-full border border-gray-300 rounded px-3 py-2">
                                    <option>Bank Transfer</option>
                                    <option>Credit Card</option>
                                    <option>Debit Card</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCloseModal}
                                className="flex-1 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    alert('Payment processed!');
                                    handleCloseModal();
                                }}
                                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                            >
                                Pay Now
                            </button>
                        </div>
                    </div>
                );

            case 'balance':
                return (
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Outstanding Balance</h3>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b">
                                <span>Current Rent:</span>
                                <span className="font-semibold">R5,000</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span>Late Fees:</span>
                                <span className="font-semibold text-red-600">R500</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span>Previous Balance:</span>
                                <span className="font-semibold">R0</span>
                            </div>
                            <div className="flex justify-between py-2 text-lg font-bold">
                                <span>Total Due:</span>
                                <span className="text-red-600">R5,500</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCloseModal}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="mt-1">
            <div className="py-4 font-semibold text-xl">Options</div>
            <div className="flex flex-col gap-4">
                {Opts.map((Opt, index) => (
                    <div key={index}>
                        <div
                            onClick={Opt.action}
                            className="w-[363px] h-16 bg-white hover:bg-[#e0e0e0] hover:border-l-black cursor-pointer rounded-lg pt-4 pl-4 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] border-2 border-[#e0e0e0] transition-all duration-200"
                        >
                            <div className="flex">{Opt.button}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        {renderModalContent()}
                    </div>
                </div>
            )}
        </div>
    );
};