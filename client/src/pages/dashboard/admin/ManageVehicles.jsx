import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineMagnifyingGlass, HiOutlineTrash } from 'react-icons/hi2';
import { toast } from 'react-hot-toast';
import { Button, Input, Badge } from '../../../components/common';
import { getVehicles, deleteVehicle } from '../../../features/vehicles/vehicleSlice';

const ManageVehicles = () => {
  const dispatch = useDispatch();
  const { vehicles, isLoading } = useSelector((state) => state.vehicle);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getVehicles());
  }, [dispatch]);

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    vehicle.provider?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await dispatch(deleteVehicle(id)).unwrap();
        toast.success('Vehicle deleted');
      } catch (err) {
        toast.error(err || 'Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h3 text-surface-900">Manage Vehicles</h1>
          <p className="text-body-sm text-surface-500">View and manage all vehicle listings.</p>
        </div>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-surface-100">
          <div className="w-full sm:max-w-md">
            <Input
              name="search"
              placeholder="Search vehicles or providers..."
              leftIcon={<HiOutlineMagnifyingGlass className="w-5 h-5" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              containerClassName="mb-0"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-50 text-caption text-surface-500 uppercase tracking-wider">
                <th className="p-4 font-medium">Vehicle</th>
                <th className="p-4 font-medium">Provider</th>
                <th className="p-4 font-medium">Price/Day</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle._id} className="hover:bg-surface-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg bg-surface-100 overflow-hidden flex-shrink-0">
                        <img 
                          src={vehicle.images?.[0]?.url || 'https://via.placeholder.com/100'} 
                          alt={vehicle.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-body-sm font-semibold text-surface-900">{vehicle.name}</p>
                        <p className="text-caption text-surface-500 capitalize">{vehicle.type} • {vehicle.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-body-sm text-surface-700">
                    {vehicle.provider?.name || 'Unknown'}
                  </td>
                  <td className="p-4 text-body-sm font-medium text-surface-900">
                    ₹{vehicle.pricePerDay?.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4">
                    <Badge variant={vehicle.isAvailable ? 'success' : 'error'}>
                      {vehicle.isAvailable ? 'Available' : 'Offline'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" className="px-3" onClick={() => window.open(`/vehicles/${vehicle._id}`, '_blank')}>
                        View
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="px-3" 
                        leftIcon={<HiOutlineTrash className="w-4 h-4" />}
                        onClick={() => handleDelete(vehicle._id, vehicle.name)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVehicles.length === 0 && (
            <div className="p-12 text-center text-surface-500">
              No vehicles found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageVehicles;
