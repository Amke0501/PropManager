import { useState } from 'react';
import { X } from 'lucide-react';
import { maintenanceAPI } from '../../../services/api';

export const Options = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        property_id: ''
    });

    const handleOptionClick = (type) => {
        setModalType(type);
        setShowModal(true);

        // Reset form
        setFormData({
            title: '',
            description: '',
            property_id: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            switch (modalType) {
                case 'notice':
                    // Handle notice submission
                    console.log('Submitting notice:', formData);
                    alert('Notice submitted successfully!');
                    break;

                case 'maintenance':
                    await maintenanceAPI.create(formData);
                    alert('Maintenance request submitted successfully!');
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
            alert('Failed to submit request');
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
        switch (modalType) {
            case 'notice':
                return (
                    <>
                        <h3 className="text-xl font-bold mb-4">Submit Notice</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Notice Type
                                </label>
                                <select
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                >
                                    <option value="">Select type...</option>
                                    <option value="Move Out Notice">Move Out Notice</option>
                                    <option value="Complaint">Complaint</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Details
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full border border-gray-300 rounded px-3 py-2 h-32"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 bg-gray-200 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </>
                );

            case 'maintenance':
                return (
                    <>
                        <h3 className="text-xl font-bold mb-4">Maintenance Request</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Issue Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="e.g., Leaking Faucet"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full border border-gray-300 rounded px-3 py-2 h-32"
                                    placeholder="Describe the issue in detail..."
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Property/Unit
                                </label>
                                <input
                                    type="text"
                                    value={formData.property_id}
                                    onChange={(e) => setFormData({...formData, property_id: e.target.value})}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="Your unit number"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 bg-gray-200 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </>
                );

            case 'payment':
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Make a Payment</h3>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Current Balance: <span className="font-bold text-lg">R0,00</span>
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
                                className="flex-1 bg-gray-200 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    alert('Payment processed!');
                                    handleCloseModal();
                                }}
                                className="flex-1 bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Pay Now
                            </button>
                        </div>
                    </div>
                );

            case 'balance':
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Outstanding Balance</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b">
                                <span>Current Rent:</span>
                                <span className="font-semibold">R0</span>
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
                                <span className="text-red-600">R0</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCloseModal}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded mt-4"
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
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            {renderModalContent()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}