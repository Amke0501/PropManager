const API_URL = 'http://localhost:3000/api';

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const authAPI = {
    // GET current user profile
    getProfile: async () => {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
    },

    // PUT update user profile
    updateProfile: async (profileData) => {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(profileData)
        });
        if (!response.ok) throw new Error('Failed to update profile');
        return response.json();
    },

    // POST change password
    changePassword: async (newPassword) => {
        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ newPassword })
        });
        if (!response.ok) throw new Error('Failed to change password');
        return response.json();
    }
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
    },

    confirm: async (id) => {
        const response = await fetch(`${API_URL}/events/${id}/confirm`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to confirm event');
        return response.json();
    },

    complete: async (id) => {
        const response = await fetch(`${API_URL}/events/${id}/complete`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to complete event');
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
        const data = await response.json().catch(() => null);
        if (!response.ok) {
            throw new Error(data?.message || data?.error || 'Failed to create property');
        }
        return data;
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

// Tenants API - Fetch tenant information
// Used by admin dashboard to display tenant counts and information
export const tenantsAPI = {
    // GET all tenants (admin only)
    // Returns array of tenant user objects with their details
    getAll: async () => {
        const response = await fetch(`${API_URL}/tenants`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch tenants');
        return response.json();
    }
};

// Communication/Messages API - Handle messaging between users
// Allows tenants and landlords to communicate within the app
export const communicationAPI = {
    // GET all messages for the current user
    // Returns messages where user is either sender or receiver
    getAll: async () => {
        const response = await fetch(`${API_URL}/communication`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch messages');
        return response.json();
    },

    // POST a new message
    // receiver_id: ID of user to send message to
    // message: Text content of the message
    send: async (receiver_id, message) => {
        const response = await fetch(`${API_URL}/communication`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ receiver_id, message })
        });
        if (!response.ok) throw new Error('Failed to send message');
        return response.json();
    }
};

// Notices API - Handle announcements and notices
// Allows admins to post notices that all tenants can see
export const noticesAPI = {
    // GET all notices
    getAll: async () => {
        const response = await fetch(`${API_URL}/notices`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch notices');
        return response.json();
    },

    // POST create a new notice (admin only)
    create: async (noticeData) => {
        const response = await fetch(`${API_URL}/notices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(noticeData)
        });
        if (!response.ok) throw new Error('Failed to create notice');
        return response.json();
    },

    // DELETE a notice (admin only)
    delete: async (id) => {
        const response = await fetch(`${API_URL}/notices/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete notice');
        return response.json();
    },

    // POST mark a notice as read
    markAsRead: async (id) => {
        const response = await fetch(`${API_URL}/notices/${id}/read`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to mark notice as read');
        return response.json();
    },

    // GET read status for current user
    getReadStatus: async () => {
        const response = await fetch(`${API_URL}/notices/read-status`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch read status');
        return response.json();
    }
};

// Reports API - Fetch analytics and statistics
// Provides revenue, occupancy, and maintenance reports for admins
export const reportsAPI = {
    // GET occupancy report - Shows vacant vs occupied properties
    getOccupancy: async () => {
        const response = await fetch(`${API_URL}/reports/occupancy`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch occupancy report');
        return response.json();
    },

    // GET revenue report - Shows total income, expenses, profit
    // Optional query params: startDate, endDate for filtering
    getRevenue: async (startDate = null, endDate = null) => {
        let url = `${API_URL}/reports/revenue`;
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch revenue report');
        return response.json();
    }
};

// Payments API - Handle rent payments and payment history
export const paymentsAPI = {
    // GET all payments - Admin sees all, tenants see their own
    getAll: async () => {
        const response = await fetch(`${API_URL}/payments`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch payments');
        return response.json();
    },

    // POST payment submission for tenant
    submit: async (paymentData) => {
        const response = await fetch(`${API_URL}/payments/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(paymentData)
        });
        if (!response.ok) throw new Error('Failed to submit payment');
        return response.json();
    },

    // GET payment history for a specific tenant
    getHistory: async (tenantId) => {
        const response = await fetch(`${API_URL}/payments/history/${tenantId}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch payment history');
        return response.json();
    }
};