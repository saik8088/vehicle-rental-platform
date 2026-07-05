import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlinePhoto, HiXMark } from 'react-icons/hi2';
import { toast } from 'react-hot-toast';
import { Button, Input, Select, Textarea } from '../../../components/common';
import { createVehicle, getVehicle, updateVehicle, reset } from '../../../features/vehicles/vehicleSlice';

const VehicleForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { vehicle, isLoading, isSuccess, isError, message } = useSelector((state) => state.vehicle);

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

  const [imageFiles, setImageFiles] = useState([]); // File objects for upload
  const [imagePreviews, setImagePreviews] = useState([]); // preview URLs
  const [existingImages, setExistingImages] = useState([]); // existing Cloudinary images (edit mode)

  // If editing, fetch vehicle and pre-fill
  useEffect(() => {
    if (isEditing) {
      dispatch(getVehicle(id));
    }
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && vehicle && vehicle._id === id) {
      setFormData({
        name: vehicle.name || '',
        brand: vehicle.brand || '',
        type: vehicle.type || 'car',
        fuelType: vehicle.fuelType || 'petrol',
        transmission: vehicle.transmission || 'automatic',
        seats: vehicle.seats || 4,
        pricePerDay: vehicle.pricePerDay || '',
        pricePerHour: vehicle.pricePerHour || '',
        location: vehicle.location || '',
        description: vehicle.description || '',
        features: vehicle.features?.join(', ') || '',
      });
      setExistingImages(vehicle.images || []);
    }
  }, [vehicle, id, isEditing]);

  // Handle success/error
  useEffect(() => {
    if (isError) {
      toast.error(message || 'Something went wrong');
    }
    if (isSuccess && (imageFiles.length > 0 || formData.name)) {
      // Only navigate on create/update success, not on initial getVehicle success
    }
    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = imageFiles.length + existingImages.length;
    const remaining = 5 - totalImages;
    
    if (remaining <= 0) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const newFiles = files.slice(0, remaining);
    setImageFiles(prev => [...prev, ...newFiles]);

    // Generate previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0 && existingImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('brand', formData.brand);
    fd.append('type', formData.type);
    fd.append('fuelType', formData.fuelType);
    fd.append('transmission', formData.transmission);
    fd.append('seats', formData.seats);
    fd.append('pricePerDay', formData.pricePerDay);
    if (formData.pricePerHour) fd.append('pricePerHour', formData.pricePerHour);
    fd.append('location', formData.location);
    fd.append('description', formData.description);
    fd.append('features', formData.features);

    // Append image files
    imageFiles.forEach(file => {
      fd.append('images', file);
    });

    try {
      if (isEditing) {
        await dispatch(updateVehicle({ id, data: fd })).unwrap();
        toast.success('Vehicle updated successfully!');
      } else {
        await dispatch(createVehicle(fd)).unwrap();
        toast.success('Vehicle listed successfully!');
      }
      navigate('/dashboard/provider/vehicles');
    } catch (err) {
      toast.error(err || 'Failed to save vehicle');
    }
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
                {/* Existing images (edit mode) */}
                {existingImages.map((img, index) => (
                  <div key={`existing-${index}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-surface-200">
                    <img src={img.url} alt="Vehicle" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 bg-surface-900/60 text-white rounded-full p-1 hover:bg-error-600 transition-colors"
                    >
                      <HiXMark className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* New image previews */}
                {imagePreviews.map((preview, index) => (
                  <div key={`new-${index}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-primary-300">
                    <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 bg-surface-900/60 text-white rounded-full p-1 hover:bg-error-600 transition-colors"
                    >
                      <HiXMark className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {(imageFiles.length + existingImages.length) < 5 && (
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
