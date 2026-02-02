const API_URL = 'http://localhost:3000/api';

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const eventsAPI = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/events`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch events');
        return response.json();
    },

    create: async (eventData) => {
        const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(eventData)
        });
        if (!response.ok) throw new Error('Failed to create event');
        return response.json();
    },

    update: async (id, eventData) => {
        const response = await fetch(`${API_URL}/events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(eventData)
        });
        if (!response.ok) throw new Error('Failed to update event');
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/events/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete event');
        return response.json();
    }
};


export const propertiesAPI = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/properties`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch properties');
        return response.json();
    },

    getById: async (id) => {
        const response = await fetch(`${API_URL}/properties/${id}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch property');
        return response.json();
    },

    create: async (propertyData) => {
        const response = await fetch(`${API_URL}/properties`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(propertyData)
        });
        if (!response.ok) throw new Error('Failed to create property');
        return response.json();
    },

    update: async (id, propertyData) => {
        const response = await fetch(`${API_URL}/properties/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(propertyData)
        });
        if (!response.ok) throw new Error('Failed to update property');
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/properties/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete property');
        return response.json();
    }
};

// Maintenance Requests CRUD
export const maintenanceAPI = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/maintenance`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch maintenance requests');
        return response.json();
    },

    create: async (requestData) => {
        const response = await fetch(`${API_URL}/maintenance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(requestData)
        });
        if (!response.ok) throw new Error('Failed to create maintenance request');
        return response.json();
    },

    updateStatus: async (id, status) => {
        const response = await fetch(`${API_URL}/maintenance/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update status');
        return response.json();
    }
};