import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { supabase } from '../lib/supabase';
import { validateEmail, validateUSPhone, validateEmailOrPhone } from '../utils/validation';

interface ManualVolunteerEntryProps {
  onVolunteerAdded: () => void;
}

export default function ManualVolunteerEntry({ onVolunteerAdded }: ManualVolunteerEntryProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ageOrRank: '',
    availableDates: 'Saturday September 6, 2025 - Cemetery Project',
    skills: '',
    transportation: 'yes',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name required';
    
    if (!validateEmailOrPhone(formData.email, formData.phone)) {
      newErrors.contact = 'Either email or phone required';
    } else {
      if (formData.email && !validateEmail(formData.email)) {
        newErrors.email = 'Valid email required';
      }
      if (formData.phone && !validateUSPhone(formData.phone)) {
        newErrors.phone = 'Valid US phone required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const volunteerData = {
        volunteer_name: formData.name,
        email: formData.email || 'noemail@provided.com',
        phone: formData.phone || 'No phone provided',
        age_or_rank: formData.ageOrRank || 'Adult',
        dates_available: 'Saturday September 6, 2025 - Cemetery Headstone Restoration Project',
        skills: formData.skills || null,
        transportation: 'yes',
        questions: formData.notes || null,
        role_preference: null
      };
      
      const { error } = await supabase.from('volunteers').insert([volunteerData]);
      
      if (error) throw error;
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        ageOrRank: '',
        availableDates: 'Saturday September 6, 2025 - Cemetery Project',
        skills: '',
        transportation: 'yes',
        notes: ''
      });
      
      onVolunteerAdded();
      alert('Volunteer added successfully!');
      
    } catch (error) {
      console.error('Error adding volunteer:', error);
      alert('Failed to add volunteer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Project Volunteer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="volunteerName">Full Name*</Label>
            <Input
              id="volunteerName"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={errors.name ? "border-red-500" : ""}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="volunteerEmail">Email</Label>
              <Input
                id="volunteerEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={errors.email || errors.contact ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label htmlFor="volunteerPhone">Phone</Label>
              <Input
                id="volunteerPhone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className={errors.phone || errors.contact ? "border-red-500" : ""}
                placeholder="(XXX) XXX-XXXX"
              />
            </div>
          </div>
          
          {errors.contact && (
            <p className="text-red-500 text-sm">{errors.contact}</p>
          )}
          
          <div>
            <Label htmlFor="ageOrRank">Age/Scout Rank</Label>
            <Input
              id="ageOrRank"
              value={formData.ageOrRank}
              onChange={(e) => setFormData({...formData, ageOrRank: e.target.value})}
              placeholder="e.g., 16, Eagle Scout, Adult"
            />
          </div>
          
          <div>
            <Label htmlFor="availableDates">Available Dates</Label>
            <textarea
              id="availableDates"
              rows={2}
              value={formData.availableDates}
              onChange={(e) => setFormData({...formData, availableDates: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="When are you available to volunteer?"
            />
          </div>
          
          <div>
            <Label htmlFor="skills">Skills/Experience</Label>
            <textarea
              id="skills"
              rows={2}
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Any relevant skills or experience?"
            />
          </div>
          
          <div>
            <Label htmlFor="transportation">Transportation*</Label>
            <select
              id="transportation"
              value={formData.transportation}
              onChange={(e) => setFormData({...formData, transportation: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="yes">I can provide my own transportation</option>
              <option value="no">I need transportation</option>
              <option value="sometimes">Transportation sometimes available</option>
            </select>
          </div>
          

          
          <div>
            <Label htmlFor="volunteerNotes">Notes</Label>
            <textarea
              id="volunteerNotes"
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Additional notes..."
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 min-h-[44px]"
          >
            {loading ? 'Adding Volunteer...' : 'Add Volunteer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}