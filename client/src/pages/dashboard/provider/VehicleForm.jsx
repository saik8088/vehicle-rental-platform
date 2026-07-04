import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlinePhoto, HiXMark } from 'react-icons/hi2';
import { Button, Input, Select, Textarea } from '../../../components/common';

const VehicleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    type: 'car',
    fuelType: 'petrol',
    transmission: 'automatic',
    seats: 4,
    pricePerDay: '',
    pricePerHour: '',
    location: '',
    description: '',
    features: '',
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    // Mock image upload
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages].slice(0, 5)); // max 5 images
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard/provider/vehicles');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-h3 text-surface-900">{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</h1>
        <p className="text-body-sm text-surface-500">Provide details about your vehicle to list it for rent.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Info */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-h5 text-surface-900 mb-6">Basic Details</h2>
          <div className="space-y-4">
            <Input
              label="Vehicle Name"
              name="name"
              placeholder="e.g. Honda City 2023"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Brand"
                name="brand"
                placeholder="e.g. Honda"
                value={formData.brand}
                onChange={handleChange}
                required
              />
              <Select
                label="Vehicle Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={[
                  { label: 'Car', value: 'car' },
                  { label: 'Bike', value: 'bike' },
                  { label: 'Scooter', value: 'scooter' },
                ]}
                required
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-h5 text-surface-900 mb-6">Specifications</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Select
              label="Fuel Type"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              options={[
                { label: 'Petrol', value: 'petrol' },
                { label: 'Diesel', value: 'diesel' },
                { label: 'Electric', value: 'electric' },
                { label: 'Hybrid', value: 'hybrid' },
              ]}
              required
            />
            <Select
              label="Transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              options={[
                { label: 'Automatic', value: 'automatic' },
                { label: 'Manual', value: 'manual' },
              ]}
              required
            />
            <Input
              label="Number of Seats"
              name="seats"
              type="number"
              min="1"
              value={formData.seats}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Pricing & Location */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-h5 text-surface-900 mb-6">Listing Info</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <Input
              label="Price Per Day (₹)"
              name="pricePerDay"
              type="number"
              placeholder="e.g. 2500"
              value={formData.pricePerDay}
              onChange={handleChange}
              required
            />
            <Input
              label="Price Per Hour (₹) - Optional"
              name="pricePerHour"
              type="number"
              placeholder="e.g. 200"
              value={formData.pricePerHour}
              onChange={handleChange}
            />
          </div>
          <Input
            label="Location (City/Area)"
            name="location"
            placeholder="e.g. Hitech City, Hyderabad"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description & Images */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-h5 text-surface-900 mb-6">Details & Media</h2>
          <div className="space-y-4">
            <Textarea
              label="Description"
              name="description"
              placeholder="Describe your vehicle's condition, rules, or any special instructions..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
            <Textarea
              label="Features (comma separated)"
              name="features"
              placeholder="e.g. AC, Bluetooth, Sunroof, Power Steering"
              value={formData.features}
              onChange={handleChange}
              rows={2}
            />

            <div>
              <label className="block text-body-sm font-medium text-surface-700 mb-2">
                Photos (Max 5)
              </label>
              
              <div className="flex flex-wrap gap-4 mb-4">
                {images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-surface-200">
                    <img src={img} alt="Upload preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-surface-900/60 text-white rounded-full p-1 hover:bg-error-600 transition-colors"
                    >
                      <HiXMark className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="w-24 h-24 rounded-lg border-2 border-dashed border-surface-300 hover:border-primary-500 bg-surface-50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <HiOutlinePhoto className="w-6 h-6 text-surface-400 mb-1" />
                    <span className="text-[10px] text-surface-500 font-medium">Add Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => navigate('/dashboard/provider/vehicles')}
          >
            Cancel
          </Button>
          <Button type="submit" size="lg" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'List Vehicle'}
          </Button>
        </div>

      </form>
    </div>
  );
};

export default VehicleForm;
