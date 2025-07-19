'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import createClientForBrowser from '@/utils/supabase/client';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '' });
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClientForBrowser();
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setForm({
          name: data.user.user_metadata?.name || '',
          email: data.user.email || '',
        });
        setPhotoUrl(data.user.user_metadata?.avatar_url || '');
        setIsLoading(false);
      } else {
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const supabase = createClientForBrowser();
    const updates = {
      data: {
        name: form.name,
        avatar_url: photoUrl,
      },
    };
    await supabase.auth.updateUser(updates);
    alert('Profile updated!');
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClientForBrowser();
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user.id}.${fileExt}`;
    const { data, error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (error) {
      alert('Upload failed!');
      setUploading(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setPhotoUrl(publicUrlData.publicUrl);
    setUploading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101113] flex flex-col items-center justify-center px-4">
      <div className="bg-[#18191b] rounded-2xl shadow-xl p-8 border border-gray-700 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Profile</h1>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 mb-2">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 flex items-center justify-center h-full">No Photo</span>
              )}
            </div>
            <label className="block text-cyan-400 cursor-pointer">
              {uploading ? 'Uploading...' : 'Change Photo'}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-[#101113] text-white placeholder-gray-400 border-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-[#101113] text-white placeholder-gray-400 border-gray-600"
              required
              disabled
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-400 text-black py-3 px-4 rounded-lg font-medium hover:bg-cyan-300 disabled:opacity-50"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
} 