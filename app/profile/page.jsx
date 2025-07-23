'use client';
import { useEffect, useState } from 'react';
import { FiEdit2, FiCheck, FiX, FiLogOut } from 'react-icons/fi';
import createClientForBrowser from '@/utils/supabase/client';
import Navbar from '../Navbar';

function getInitials(name, email) {
  if (name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return '?';
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editField, setEditField] = useState(null); // 'name' | 'email' | null
  const [form, setForm] = useState({ name: '', email: '' });
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        window.location.href = '/login';
      }
    };
    fetchUser();
  }, []);

  const handleEdit = (field) => {
    setEditField(field);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditField(null);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (field) => {
    setError('');
    setSuccess('');
    const supabase = createClientForBrowser();
    let updates = {};
    if (field === 'name') {
      updates = { data: { name: form.name, avatar_url: photoUrl } };
    } else if (field === 'email') {
      updates = { email: form.email };
    }
    const { error } = await supabase.auth.updateUser(updates);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Profile updated!');
      setEditField(null);
      // Optionally, refetch user
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setForm({
          name: data.user.user_metadata?.name || '',
          email: data.user.email || '',
        });
        setPhotoUrl(data.user.user_metadata?.avatar_url || '');
      }
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    setSuccess('');
    const supabase = createClientForBrowser();
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user.id}.${fileExt}`;
    const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (error) {
      setError('Upload failed!');
      setUploading(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setPhotoUrl(publicUrlData.publicUrl);
    // Save avatar_url to user metadata
    await supabase.auth.updateUser({ data: { avatar_url: publicUrlData.publicUrl } });
    setSuccess('Photo updated!');
    setUploading(false);
  };

  const handleLogout = async () => {
    const supabase = createClientForBrowser();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101113] flex flex-col items-center justify-center px-4">
      <Navbar />
      <div className="bg-[#18191b] rounded-2xl shadow-xl p-8 border border-gray-700 w-full max-w-md mt-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Profile</h1>
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-cyan-800 flex items-center justify-center text-3xl font-bold text-white mb-2 relative">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{getInitials(form.name, form.email)}</span>
            )}
            <label className="absolute bottom-0 right-0 bg-cyan-500 rounded-full p-1 cursor-pointer border-2 border-[#18191b]" title="Change Photo">
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
              <FiEdit2 className="text-white text-lg" />
            </label>
          </div>
          {uploading && <span className="text-cyan-400 text-xs mt-1">Uploading...</span>}
        </div>
        <div className="space-y-6">
          {/* Name Field */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-xs mb-1">Name</div>
              {editField === 'name' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-lg bg-[#101113] text-white border border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  />
                  <button type="button" onClick={() => handleSave('name')} className="text-cyan-400 hover:text-cyan-300"><FiCheck /></button>
                  <button type="button" onClick={handleCancel} className="text-red-400 hover:text-red-300"><FiX /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-white text-lg font-medium">{form.name}</span>
                  <button type="button" onClick={() => handleEdit('name')} className="text-cyan-400 hover:text-cyan-300" title="Edit Name"><FiEdit2 /></button>
                </div>
              )}
            </div>
          </div>
          {/* Email Field */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-xs mb-1">Email</div>
              {editField === 'email' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-lg bg-[#101113] text-white border border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  />
                  <button type="button" onClick={() => handleSave('email')} className="text-cyan-400 hover:text-cyan-300"><FiCheck /></button>
                  <button type="button" onClick={handleCancel} className="text-red-400 hover:text-red-300"><FiX /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-white text-lg font-medium">{form.email}</span>
                  <button type="button" onClick={() => handleEdit('email')} className="text-cyan-400 hover:text-cyan-300" title="Edit Email"><FiEdit2 /></button>
                </div>
              )}
            </div>
          </div>
        </div>
        {(error || success) && (
          <div className="mt-6">
            {error && <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-2">{error}</div>}
            {success && <div className="bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 px-4 py-3 rounded-lg text-sm mb-2">{success}</div>}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 mt-8 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200"
        >
          <FiLogOut className="text-lg" /> Logout
        </button>
      </div>
    </div>
  );
} 