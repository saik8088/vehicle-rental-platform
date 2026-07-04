import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineUserMinus, HiOutlineCheckCircle, HiOutlineNoSymbol } from 'react-icons/hi2';
import { Button, Input, Badge } from '../../../components/common';
import { toast } from 'react-hot-toast';
import { getUsers, deleteUser } from '../../../features/users/userSlice';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && user.role === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h3 text-surface-900">Manage Users</h1>
          <p className="text-body-sm text-surface-500">View and manage customer and provider accounts.</p>
        </div>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-surface-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:max-w-md">
            <Input
              name="search"
              placeholder="Search users by name or email..."
              leftIcon={<HiOutlineMagnifyingGlass className="w-5 h-5" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              containerClassName="mb-0"
            />
          </div>
          <div className="flex gap-2">
            <select
              className="bg-white border border-surface-200 text-surface-900 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="provider">Providers</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-50 text-caption text-surface-500 uppercase tracking-wider">
                <th className="p-4 font-medium">User Info</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Joined Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-surface-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-caption">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-body-sm font-semibold text-surface-900">{user.name}</p>
                        <p className="text-caption text-surface-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={user.role === 'provider' ? 'primary' : 'secondary'} className="capitalize">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4 text-body-sm text-surface-600">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Badge variant={user.status === 'active' || user.status === undefined ? 'success' : 'error'} className="capitalize">
                      {user.status || 'Active'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="px-4" 
                      title="Delete User"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this user?')) {
                          dispatch(deleteUser(user._id))
                            .unwrap()
                            .then(() => toast.success('User deleted successfully'))
                            .catch((err) => toast.error(err || 'Failed to delete user'));
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-surface-500">
              No users found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
