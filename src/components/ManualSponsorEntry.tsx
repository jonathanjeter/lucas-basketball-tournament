import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { supabase, testStorage } from '../lib/supabase';
import { validateEmail, validateUSPhone } from '../utils/validation';

interface ManualSponsorEntryProps {
  onSponsorAdded: () => void;
}

export default function ManualSponsorEntry({ onSponsorAdded }: ManualSponsorEntryProps) {
  const [formData, setFormData] = useState({
    sponsorType: 'business' as 'business' | 'individual',
    companyName: '',
    contactName: '',
    individualName: '',
    email: '',
    phone: '',
    website: '',
    donationType: 'monetary' as 'monetary' | 'item',
    donationAmount: '',
    itemDescription: '',
    estimatedValue: '',
    notes: '',
    logoFile: null as File | null,
    logoUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (formData.sponsorType === 'business') {
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name required';
      if (!formData.contactName.trim()) newErrors.contactName = 'Contact name required';
    } else {
      if (!formData.individualName.trim()) newErrors.individualName = 'Name required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Valid email required';
    }
    
    if (formData.phone && !validateUSPhone(formData.phone)) {
      newErrors.phone = 'Valid US phone required';
    }
    
    if (formData.donationType === 'monetary') {
      if (!formData.donationAmount || parseFloat(formData.donationAmount) <= 0) {
        newErrors.donationAmount = 'Donation amount required';
      }
    } else {
      if (!formData.itemDescription.trim()) newErrors.itemDescription = 'Item description required';
      if (!formData.estimatedValue || parseFloat(formData.estimatedValue) <= 0) {
        newErrors.estimatedValue = 'Estimated value required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add logo upload handler
  const handleLogoUpload = async (file: File) => {
    if (!file) return '';
    
    setUploadingLogo(true);
    
    try {
      console.log('Testing storage connection...');
      const storageTest = await testStorage();
      if (!storageTest) {
        throw new Error('Storage not available, using fallback');
      }
      
      console.log('Starting logo upload for file:', file.name);
      
      // Validate file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please use JPG, PNG, or GIF.');
      }
      
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File too large. Maximum size is 2MB.');
      }
      
      // Create unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `sponsor_${timestamp}.${fileExt}`;
      
      console.log('Uploading to bucket: sponsor-logos with filename:', fileName);
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('sponsor-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }
      
      console.log('Upload successful:', data);
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('sponsor-logos')  
        .getPublicUrl(fileName);
      
      console.log('Public URL generated:', publicUrl);
      return publicUrl;
      
    } catch (error) {
      console.error('Main upload failed, using fallback method');
      
      // Fallback: Create blob URL for development
      try {
        const blobUrl = URL.createObjectURL(file);
        console.log('Using fallback blob URL:', blobUrl);
        
        // Store file info for potential later upload
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          blobUrl: blobUrl
        };
        
        // You could store this in localStorage for persistence
        localStorage.setItem(`sponsor_logo_${Date.now()}`, JSON.stringify(fileData));
        
        return blobUrl;
        
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        alert('Unable to upload logo. Please try again or contact administrator.');
        return '';
      }
    } finally {
      setUploadingLogo(false);
    }
  };


  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or GIF file');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert('File size must be less than 2MB');
      return;
    }
    
    setFormData(prev => ({ ...prev, logoFile: file }));
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Check if logo upload should be shown
  const shouldShowLogoUpload = () => {
    if (formData.donationType === 'monetary') {
      return parseFloat(formData.donationAmount) >= 40;
    } else {
      return parseFloat(formData.estimatedValue) >= 40;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      let logoUrl = '';
      
      // Upload logo if file selected and amount >= $40
      if (formData.logoFile && shouldShowLogoUpload()) {
        logoUrl = await handleLogoUpload(formData.logoFile);
      }
      
      const sponsorData = {
        sponsor_type: formData.sponsorType,
        company_name: formData.sponsorType === 'business' ? formData.companyName : null,
        contact_name: formData.sponsorType === 'business' ? formData.contactName : formData.individualName,
        email: formData.email,
        phone: formData.phone || null,
        website: formData.website || null,
        donation_type: formData.donationType,
        donation_amount: formData.donationType === 'monetary' ? parseFloat(formData.donationAmount) : null,
        item_description: formData.donationType === 'item' ? formData.itemDescription : null,
        estimated_value: formData.donationType === 'item' ? parseFloat(formData.estimatedValue) : null,
        logo_url: logoUrl || null,
        approved: true, // Auto-approve manual entries
        notes: formData.notes || null,
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase.from('sponsors').insert([sponsorData]);
      
      if (error) throw error;
      
      // Reset form and preview
      setFormData({
        sponsorType: 'business',
        companyName: '',
        contactName: '',
        individualName: '',
        email: '',
        phone: '',
        website: '',
        donationType: 'monetary',
        donationAmount: '',
        itemDescription: '',
        estimatedValue: '',
        notes: '',
        logoFile: null,
        logoUrl: ''
      });
      setLogoPreview('');
      
      onSponsorAdded();
      alert('Sponsor added successfully!');
      
    } catch (error) {
      console.error('Error adding sponsor:', error);
      alert('Failed to add sponsor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Sponsor Manually</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="business"
                checked={formData.sponsorType === 'business'}
                onChange={(e) => setFormData({...formData, sponsorType: e.target.value as 'business'})}
              />
              <span>Business</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="individual"
                checked={formData.sponsorType === 'individual'}
                onChange={(e) => setFormData({...formData, sponsorType: e.target.value as 'individual'})}
              />
              <span>Individual</span>
            </label>
          </div>
          
          {formData.sponsorType === 'business' ? (
            <>
              <div>
                <Label htmlFor="companyName">Company Name*</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className={errors.companyName ? "border-red-500" : ""}
                />
              </div>
              <div>
                <Label htmlFor="contactName">Contact Person*</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  className={errors.contactName ? "border-red-500" : ""}
                />
              </div>
            </>
          ) : (
            <div>
              <Label htmlFor="individualName">Name*</Label>
              <Input
                id="individualName"
                value={formData.individualName}
                onChange={(e) => setFormData({...formData, individualName: e.target.value})}
                className={errors.individualName ? "border-red-500" : ""}
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={errors.email ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className={errors.phone ? "border-red-500" : ""}
                placeholder="(XXX) XXX-XXXX"
              />
            </div>
          </div>
          
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="monetary"
                checked={formData.donationType === 'monetary'}
                onChange={(e) => setFormData({...formData, donationType: e.target.value as 'monetary'})}
              />
              <span>Monetary</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="item"
                checked={formData.donationType === 'item'}
                onChange={(e) => setFormData({...formData, donationType: e.target.value as 'item'})}
              />
              <span>Item</span>
            </label>
          </div>
          
          {formData.donationType === 'monetary' ? (
            <div>
              <Label htmlFor="donationAmount">Donation Amount*</Label>
              <Input
                id="donationAmount"
                type="number"
                min="1"
                step="0.01"
                value={formData.donationAmount}
                onChange={(e) => setFormData({...formData, donationAmount: e.target.value})}
                className={errors.donationAmount ? "border-red-500" : ""}
              />
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="itemDescription">Item Description*</Label>
                <textarea
                  id="itemDescription"
                  rows={3}
                  value={formData.itemDescription}
                  onChange={(e) => setFormData({...formData, itemDescription: e.target.value})}
                  className={`w-full p-2 border rounded-md ${errors.itemDescription ? "border-red-500" : "border-gray-300"}`}
                />
              </div>
              <div>
                <Label htmlFor="estimatedValue">Estimated Value*</Label>
                <Input
                  id="estimatedValue"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({...formData, estimatedValue: e.target.value})}
                  className={errors.estimatedValue ? "border-red-500" : ""}
                />
              </div>
            </>
          )}
          
          {shouldShowLogoUpload() && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="mb-3">
                <Label htmlFor="logo" className="text-blue-800 font-medium">
                  Upload Logo (Optional)
                </Label>
                <p className="text-sm text-blue-700 mb-2">
                  Sponsors contributing $40+ will be featured with their logo on our homepage!
                </p>
              </div>
              
              <input
                id="logo"
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={handleFileChange}
                className="mb-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              
              {logoPreview && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Logo Preview:</p>
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="max-w-32 max-h-32 object-contain border border-gray-200 rounded"
                  />
                </div>
              )}
              
              {uploadingLogo && (
                <div className="text-sm text-blue-600">
                  Uploading logo...
                </div>
              )}
              
              <p className="text-xs text-blue-600 mt-2">
                Accepted formats: JPG, PNG, GIF (max 2MB)
              </p>
            </div>
          )}
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Additional notes about this sponsor..."
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 min-h-[44px]"
          >
            {loading ? 'Adding Sponsor...' : 'Add Sponsor'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}