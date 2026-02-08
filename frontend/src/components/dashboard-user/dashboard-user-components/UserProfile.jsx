import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Save, X, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../../../Services/api';

export const UserProfile = () => {
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');

    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
    });

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (showModal && activeTab === 'profile') {
            fetchProfile();
        }
    }, [showModal, activeTab]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await authAPI.getProfile();
            if (data.success) {
                setProfileData({
                    firstName: data.user.firstName || '',
                    lastName: data.user.lastName || '',
                    email: data.user.email || '',
                    phone: data.user.phone || '',
                    address: data.user.address || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const response = await authAPI.updateProfile({
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                phone: profileData.phone,
                address: profileData.address
            });

            if (response.success) {
                setMessage('Profile updated successfully!');
                setTimeout(() => {
                    setMessage('');
                    setShowModal(false);
                }, 2000);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Failed to update profile: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!passwordData.newPassword || !passwordData.confirmPassword) {
            setMessage('Please fill in all password fields');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long');
            return;
        }

        try {
            setSaving(true);
            const response = await authAPI.changePassword(passwordData.newPassword);

            if (response.success) {
                setMessage('Password changed successfully!');
                setPasswordData({ newPassword: '', confirmPassword: '' });
                setTimeout(() => {
                    setMessage('');
                    setShowModal(false);
                }, 2000);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setMessage('Failed to change password: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mt-6">
            <button
                onClick={() => {
                    setShowModal(true);
                    setActiveTab('profile');
                    setMessage('');
                }}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
            >
                <User className="size-4" />
                Manage Profile
            </button>

            {/* Profile Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold">Profile Settings</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b">
                            <button
                                onClick={() => {
                                    setActiveTab('profile');
                                    setMessage('');
                                }}
                                className={`flex-1 py-3 px-4 text-center font-medium ${
                                    activeTab === 'profile'
                                        ? 'border-b-2 border-blue-500 text-blue-500'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Profile Info
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('password');
                                    setMessage('');
                                }}
                                className={`flex-1 py-3 px-4 text-center font-medium ${
                                    activeTab === 'password'
                                        ? 'border-b-2 border-blue-500 text-blue-500'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Password
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {message && (
                                <div className={`mb-4 p-3 rounded text-sm ${
                                    message.includes('successfully')
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {message}
                                </div>
                            )}

                            {activeTab === 'profile' && (
                                <form onSubmit={handleSaveProfile}>
                                    {loading ? (
                                        <div className="text-center py-8">
                                            <div className="inline-block animate-spin">
                                                <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-4">
                                                {/* First Name */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={profileData.firstName}
                                                        onChange={handleProfileChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                        placeholder="Enter first name"
                                                    />
                                                </div>

                                                {/* Last Name */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        value={profileData.lastName}
                                                        onChange={handleProfileChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                        placeholder="Enter last name"
                                                    />
                                                </div>

                                                {/* Email */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        <Mail className="inline size-4 mr-1" />
                                                        Email (Read-only)
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={profileData.email}
                                                        disabled
                                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
                                                    />
                                                </div>

                                                {/* Phone */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        <Phone className="inline size-4 mr-1" />
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={profileData.phone}
                                                        onChange={handleProfileChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                        placeholder="Enter phone number"
                                                    />
                                                </div>

                                                {/* Address */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        <MapPin className="inline size-4 mr-1" />
                                                        Address
                                                    </label>
                                                    <textarea
                                                        name="address"
                                                        value={profileData.address}
                                                        onChange={handleProfileChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                                                        rows="3"
                                                        placeholder="Enter your address"
                                                    />
                                                </div>
                                            </div>

                                            {/* Save Button */}
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="w-full mt-6 py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center gap-2"
                                            >
                                                <Save className="size-4" />
                                                {saving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </>
                                    )}
                                </form>
                            )}

                            {activeTab === 'password' && (
                                <form onSubmit={handleChangePassword}>
                                    <div className="space-y-4">
                                        {/* New Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                <Lock className="inline size-4 mr-1" />
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="newPassword"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                    placeholder="Enter new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="size-5" />
                                                    ) : (
                                                        <Eye className="size-5" />
                                                    )}
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Must be at least 6 characters
                                            </p>
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                <Lock className="inline size-4 mr-1" />
                                                Confirm Password
                                            </label>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>

                                    {/* Change Password Button */}
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full mt-6 py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center gap-2"
                                    >
                                        <Lock className="size-4" />
                                        {saving ? 'Changing...' : 'Change Password'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
