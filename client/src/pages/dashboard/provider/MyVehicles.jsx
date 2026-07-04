import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import { Button, Badge } from '../../../components/common';
import { getVehicles } from '../../../features/vehicles/vehicleSlice';

const MyVehicles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { vehicles, isLoading } = useSelector((state) => state.vehicle);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getVehicles());
  }, [dispatch]);

  const myVehicles = vehicles.filter(v => v.provider?._id === user?._id || v.provider === user?._id);

  const toggleAvailability = (id) => {
    // To be implemented: dispatch updateVehicle
    console.log('Toggle availability for', id);
  };

  const deleteVehicleHandler = (id) => {
    if (window.confirm('Are you sure you want to remove this vehicle?')) {
      // To be implemented: dispatch deleteVehicle
      console.log('Delete vehicle', id);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-surface-500">Loading your vehicles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h3 text-surface-900">My Vehicles</h1>
          <p className="text-body-sm text-surface-500">Manage your fleet and their availability.</p>
        </div>
        <Button 
          leftIcon={<HiOutlinePlus className="w-5 h-5" />}
          onClick={() => navigate('/dashboard/provider/vehicles/new')}
        >
          Add New Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {myVehicles.map((vehicle) => (
          <div key={vehicle._id} className="card overflow-hidden flex flex-col group">
            <div className="relative h-48 overflow-hidden bg-surface-100">
              <img
                src={vehicle.images[0]?.url || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={vehicle.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <Badge variant={vehicle.isAvailable ? 'success' : 'surface'} className="shadow-sm">
                  {vehicle.isAvailable ? 'Active' : 'Offline'}
                </Badge>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="text-h6 text-surface-900 line-clamp-1">{vehicle.name}</h3>
                <span className="text-body font-bold text-primary-600 whitespace-nowrap">
                  ₹{vehicle.pricePerDay} <span className="text-caption text-surface-500 font-normal">/d</span>
                </span>
              </div>
              
              <div className="text-caption text-surface-500 mb-4">
                {vehicle.location} • {vehicle.brand} • {vehicle.type}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between bg-surface-50 p-3 rounded-xl mb-4">
                <span className="text-body-sm font-medium text-surface-700">Availability</span>
                <button 
                  onClick={() => toggleAvailability(vehicle._id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-ring ${
                    vehicle.isAvailable ? 'bg-primary-600' : 'bg-surface-300'
                  }`}
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      vehicle.isAvailable ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-surface-100">
                <Button 
                  variant="secondary" 
                  className="flex-1 text-surface-600 hover:text-primary-600"
                  leftIcon={<HiOutlinePencilSquare className="w-4 h-4" />}
                  onClick={() => navigate(`/dashboard/provider/vehicles/${vehicle._id}/edit`)}
                >
                  Edit
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1 text-surface-600 hover:text-error-600 hover:bg-error-50 border-transparent hover:border-error-200"
                  leftIcon={<HiOutlineTrash className="w-4 h-4" />}
                  onClick={() => deleteVehicleHandler(vehicle._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {myVehicles.length === 0 && (
        <div className="card p-12 text-center">
          <h3 className="text-h5 text-surface-900 mb-2">No Vehicles Yet</h3>
          <p className="text-body text-surface-500 mb-6">Start earning by listing your first vehicle.</p>
          <Button 
            leftIcon={<HiOutlinePlus className="w-5 h-5" />}
            onClick={() => navigate('/dashboard/provider/vehicles/new')}
          >
            Add New Vehicle
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyVehicles;
