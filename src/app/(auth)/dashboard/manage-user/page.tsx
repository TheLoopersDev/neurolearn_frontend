'use client';

import React, { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { getAllUsersExceptAdminAPI } from '@/services/api/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/Card';
import AvatarWithFallback from '@/components/common/AvatarWithFallback';
import { Users, UserCheck, UserX, UserPen } from 'lucide-react';
import Loading from '@/components/common/Loading';
import CommonPagination from '@/components/common/ui/CommonPagination';

const ManageUserPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'learner' | 'instructor' | 'business'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const usersData = await getAllUsersExceptAdminAPI();
                setUsers(usersData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách user');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'instructor':
                return <UserCheck className="h-4 w-4" />;
            case 'business':
                return <Users className="h-4 w-4" />;
            case 'user':
                return <UserPen className="h-4 w-4" />;
            default:
                return <UserX className="h-4 w-4" />;
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'instructor':
                return 'instructor';
            case 'business':
                return 'business';
            case 'user':
                return 'learner';
            default:
                return role;
        }
    };

    // Lọc user theo tab hiện tại
    const filteredUsers = users.filter(user => {
        if (activeTab === 'all') return true;
        if (activeTab === 'learner') return user.role === 'user';
        if (activeTab === 'instructor') return user.role === 'instructor';
        if (activeTab === 'business') return user.businessInfo?.businessId;
        return true;
    });

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    // Reset về trang 1 khi thay đổi tab
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    if (loading) {
        return (
            <Loading message="Loading users..." />
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <UserX className="h-12 w-12 mx-auto" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">An error occurred</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
            </div>
            <div className="grid gap-6">
                {/* Thống kê tổng quan */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className='bg-white'>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total users</p>
                                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='bg-white'>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <UserCheck className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Instructor</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {users.filter(user => user.role === 'instructor').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='bg-white'>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <UserPen className="h-5 w-5 text-orange-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Learner</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {users.filter(user => user.role === 'user').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='bg-white'>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-purple-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Business</p>
                                    <div className="flex items-baseline space-x-1">
                                        <p className="text-2xl font-bold text-gray-900">
                                            {users.filter(user => user.businessInfo?.businessId).length}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            ({users.filter(user => user.businessInfo?.role === 'admin').length} admins)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Danh sách user */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center space-x-2">
                                <Users className="h-5 w-5" />
                                <span>List Users</span>
                            </CardTitle>
                            {/* Tabs */}
                            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'all'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setActiveTab('learner')}
                                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'learner'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Learner
                                </button>
                                <button
                                    onClick={() => setActiveTab('instructor')}
                                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'instructor'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Instructor
                                </button>
                                <button
                                    onClick={() => setActiveTab('business')}
                                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'business'
                                        ? 'bg-purple-100 text-purple-800 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900' 
                                        }`}
                                >
                                    Business
                                </button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="min-h-[540px] flex flex-col">
                            {filteredUsers.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            {activeTab === 'all'
                                                ? 'No users found'
                                                : activeTab === 'learner'
                                                    ? 'No learner found'
                                                    : activeTab === 'instructor'
                                                        ? 'No instructor found'
                                                        : 'No business users found'
                                            }
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1 space-y-4">
                                        {currentUsers.map((user) => (
                                            <div
                                                key={user._id}
                                                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <AvatarWithFallback
                                                        src={user.avatar?.url || ''}
                                                        alt={user.name}
                                                        name={user.name}
                                                        size={40}
                                                        className="h-10 w-10"
                                                    />

                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {getRoleIcon(user.role)}
                                                        <span>{getRoleLabel(user.role)}</span>
                                                    </div>

                                                    {user.businessInfo?.businessId && (
                                                        <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                            <Users className="h-3 w-3" />
                                                            <span>{user.businessInfo.role || 'employee'}</span>
                                                        </div>
                                                    )}

                                                    {user.isVerified && (
                                                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                            Verified
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Phân trang */}
                                    <div>
                                        <CommonPagination
                                            page={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ManageUserPage;
