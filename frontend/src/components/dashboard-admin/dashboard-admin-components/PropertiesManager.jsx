import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { propertiesAPI } from '../../../Services/api';

export const PropertiesManager = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        rent: '',
        status: 'available'
    });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const data = await propertiesAPI.getAll();
            setProperties(data?.data ?? data ?? []);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);
        try {
            if (editingProperty) {
                console.log('Updating property:', editingProperty.id);
                await propertiesAPI.update(editingProperty.id, formData);
            } else {
                console.log('Creating new property');
                const result = await propertiesAPI.create(formData);
                console.log('Property created:', result);
            }
            fetchProperties();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving property:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await propertiesAPI.delete(id);
                fetchProperties();
            } catch (error) {
                console.error('Error deleting property:', error);
            }
        }
    };

    const handleEdit = (property) => {
        setEditingProperty(property);
        setFormData({
            name: property.name,
            address: property.address,
            rent: property.rent,
            status: property.status
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProperty(null);
        setFormData({
            name: '',
            address: '',
            rent: '',
            status: 'available'
        });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Properties</h2>
                <button
                    onClick={() => {
                        console.log('Add Property button clicked');
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Add Property
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map((property) => (
                    <div
                        key={property.id}
                        className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:shadow-lg transition-shadow"
                    >
                        <h3 className="font-bold text-lg mb-2">{property.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{property.address}</p>
                        <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-green-600">
                R{property.rent}/month
              </span>
                            <span
                                className={`px-2 py-1 rounded text-xs ${
                                    property.status === 'occupied'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-green-100 text-green-800'
                                }`}
                            >
                {property.status}
              </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(property)}
                                className="flex-1 flex items-center justify-center gap-1 bg-blue-100 text-blue-800 px-3 py-2 rounded hover:bg-blue-200 transition-colors"
                            >
                                <Pencil size={16} />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(property.id)}
                                className="flex-1 flex items-center justify-center gap-1 bg-red-100 text-red-800 px-3 py-2 rounded hover:bg-red-200 transition-colors"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">
                                {editingProperty ? 'Edit Property' : 'Add New Property'}
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
                                    Property Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Monthly Rent
                                </label>
                                <input
                                    type="number"
                                    value={formData.rent}
                                    onChange={(e) =>
                                        setFormData({ ...formData, rent: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({ ...formData, status: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                >
                                    <option value="available">Available</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="maintenance">Under Maintenance</option>
                                </select>
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
                                    {editingProperty ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};