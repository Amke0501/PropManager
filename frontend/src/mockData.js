// Mock data for properties
export const mockProperties = [
    {
        id: 1, 
        address: "987 Apple Street, Johnanesburg, South Africa",
        type: "Apartment",
        units: 6,
        monthlyRent: 7600,
        status: "Occupied"
    }

    {
        id: 2, 
        address: "876 Banana Street, Pretoria, South Africa",
        type: "Apartment",
        units: 3,
        monthlyRent: 5600,
        status: "Occupied"
    }

    {
        id: 3, 
        address: "765 Cherry Street, Cape Town, South Africa",
        type: "Townhouse",
        units: 1,
        monthlyRent: 8500,
        status: "Occupied"
    }

    {
        id: 4, 
        address: "654 Mango Street, Durban, South Africa",
        type: "Townhouse",
        units: 1,
        monthlyRent: 10000,
        status: "Vacant"
    }
]

// Mock data for tenants
export const mockTenants = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+27 12 345 6789",
        propertyId: 1
        leaseStart: "2023-01-01",
        leaseEnd: "2023-12-31"
        rentAmount: 7600
        paymentStatus: "Paid"
    },
    {
        id: 2,
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "+27 13 345 6789",
        propertyId: 2
        leaseStart: "2023-01-01",
        leaseEnd: "2023-12-31"
        rentAmount: 5600
        paymentStatus: "Paid"
    },
    {
        id: 3,
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        phone: "+27 14 345 6789",
        propertyId: 3
        leaseStart: "2023-01-01",
        leaseEnd: "2023-12-31"
        rentAmount: 8500
        paymentStatus: "Paid"
    },
    {
        id: 4,
        name: "Emily Wilson",
        email: "emily.wilson@example.com",
        phone: "+27 15 345 6789",
        propertyId: 1
        leaseStart: "2023-01-01",
        leaseEnd: "2023-12-31"
        rentAmount: 7600
        paymentStatus: "Overdue"
    }
]

// Mock data for maintenance requests
// Put in more mock data
export const mockMaintenanceRequests = [
    {
        id: 1,
        tenantId: 1,
        propertyId: 1,
        issue: "Leaking faucet in kitchen",
        description: "The faucet in the kitchen is leaking and needs to be fixed.",
        priority: "High",
        status: "In Progress"
        dateReported: "2023-10-01"
    }
]

//Mock data for payments
//Put in more mock data
export const mockPayments = [
    {
        id: 1,
        tenantId: 1,
        tenantName: "John Smith",
        amount: 7600,
        datePaid: "2023-10-01",
        status: "Paid", 
        method: "Credit Card",
    }
]