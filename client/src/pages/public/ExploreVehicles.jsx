import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiFunnel, HiXMark } from 'react-icons/hi2';
import { Button, Input, Select, Checkbox, EmptyState } from '../../components/common';
import { VehicleCard } from '../../components/vehicles';
import { getVehicles } from '../../features/vehicles/vehicleSlice';

const ExploreVehicles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  const dispatch = useDispatch();
  const { vehicles, isLoading } = useSelector((state) => state.vehicle);

  useEffect(() => {
    dispatch(getVehicles());
  }, [dispatch]);

  // Form state
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    transmission: searchParams.get('transmission') || '',
    fuelType: searchParams.get('fuelType') || '',
  });

  useEffect(() => {
    let result = vehicles;
    if (filters.location) {
      result = result.filter(v => v.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.type) {
      result = result.filter(v => v.type === filters.type);
    }
    if (filters.transmission) {
      result = result.filter(v => v.transmission === filters.transmission);
    }
    if (filters.fuelType) {
      result = result.filter(v => v.fuelType === filters.fuelType);
    }
    if (filters.minPrice) {
      result = result.filter(v => v.pricePerDay >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(v => v.pricePerDay <= Number(filters.maxPrice));
    }
    setFilteredVehicles(result);
  }, [filters, vehicles]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const reset = {
      location: '', type: '', minPrice: '', maxPrice: '', transmission: '', fuelType: ''
    };
    setFilters(reset);
    setSearchParams(new URLSearchParams());
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-h6 text-surface-900">Filters</h3>
        <button 
          onClick={clearFilters}
          className="text-body-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        <Input
          label="Location"
          name="location"
          placeholder="e.g. Hyderabad"
          value={filters.location}
          onChange={handleFilterChange}
        />

        <Select
          label="Vehicle Type"
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          options={[
            { label: 'All Types', value: '' },
            { label: 'Car', value: 'car' },
            { label: 'Bike', value: 'bike' },
            { label: 'Scooter', value: 'scooter' },
          ]}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Min Price (₹)"
            name="minPrice"
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <Input
            label="Max Price (₹)"
            name="maxPrice"
            type="number"
            placeholder="Any"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
        </div>

        <Select
          label="Transmission"
          name="transmission"
          value={filters.transmission}
          onChange={handleFilterChange}
          options={[
            { label: 'Any', value: '' },
            { label: 'Automatic', value: 'automatic' },
            { label: 'Manual', value: 'manual' },
          ]}
        />

        <Select
          label="Fuel Type"
          name="fuelType"
          value={filters.fuelType}
          onChange={handleFilterChange}
          options={[
            { label: 'Any', value: '' },
            { label: 'Petrol', value: 'petrol' },
            { label: 'Diesel', value: 'diesel' },
            { label: 'Electric', value: 'electric' },
          ]}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-surface-50 min-h-screen">
      <div className="container-app py-8">
        
        {/* Mobile Header & Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <h1 className="text-h3 text-surface-900">Explore Vehicles</h1>
          <Button 
            variant="secondary" 
            size="sm"
            leftIcon={<HiFunnel className="w-4 h-4" />}
            onClick={() => setIsFilterOpen(true)}
          >
            Filters
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filter */}
          <aside className="hidden lg:block w-[300px] flex-shrink-0">
            <div className="sticky top-24 card p-6">
              <FilterContent />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div 
                className="fixed inset-0 bg-surface-900/60 backdrop-blur-sm"
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="relative w-full max-w-xs bg-white h-full shadow-modal overflow-y-auto animate-slide-right">
                <div className="flex items-center justify-between p-4 border-b border-surface-100">
                  <h2 className="text-h5 text-surface-900">Filters</h2>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 text-surface-500 hover:text-surface-700 bg-surface-50 rounded-xl"
                  >
                    <HiXMark className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <FilterContent />
                </div>
                <div className="p-4 border-t border-surface-100 mt-auto sticky bottom-0 bg-white">
                  <Button fullWidth onClick={() => setIsFilterOpen(false)}>
                    Show Results ({filteredVehicles.length})
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="hidden lg:flex items-center justify-between mb-6">
              <h1 className="text-h2 text-surface-900">Explore Vehicles</h1>
              <p className="text-body text-surface-500">
                Showing <span className="font-semibold text-surface-900">{filteredVehicles.length}</span> vehicles
              </p>
            </div>

            {isLoading ? (
              <div className="card h-[60vh] flex items-center justify-center">
                <p className="text-surface-500 text-lg">Loading vehicles...</p>
              </div>
            ) : filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle._id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="card h-[60vh]">
                <EmptyState 
                  title="No vehicles found"
                  message="We couldn't find any vehicles matching your current filters. Try adjusting your search criteria or clearing filters."
                  action={
                    <Button variant="secondary" onClick={clearFilters}>
                      Clear all filters
                    </Button>
                  }
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ExploreVehicles;
