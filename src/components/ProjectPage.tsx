import { Input } from '../components/ui/Input';
import { signupVolunteer } from '../lib/supabase';
import toast from 'react-hot-toast';

  const onSubmit = async (data: VolunteerFormData) => {
    setLoading(true);
    try {
      await signupVolunteer({
        name: data.name,
        email: data.email,
        phone: data.phone,
        age_or_rank: data.ageOrRank
      });
      toast.success('Thank you for volunteering! We\'ll be in touch with more details.');
      reset();
    } catch (error) {
      console.error('Volunteer signup error:', error);
      toast.error('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };