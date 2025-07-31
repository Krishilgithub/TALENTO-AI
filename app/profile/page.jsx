'use client';
import { useEffect, useState } from 'react';
import { FiEdit2, FiCheck, FiX, FiLogOut } from 'react-icons/fi';
import createClientForBrowser from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

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
        // Fetch name from users table
        const { data: userRow, error: userError } = await supabase
          .from('users')
          .select('name')
          .eq('id', data.user.id)
          .single();
        if (userRow && userRow.name) {
          setForm(f => ({ ...f, name: userRow.name }));
        }
        setIsLoading(false);
      } else {
        router.replace('/login');
      }
    };
    fetchUser();
  }, [router]);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#101113] via-[#18191b] to-[#23272f]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#101113] via-[#18191b] to-[#23272f]">
      {/* Sidebar (dashboard style) */}
      <aside className="w-72 bg-[#18191b] border-r border-gray-800 flex flex-col py-6 px-4 min-h-screen relative transition-all duration-300 shadow-2xl">
        <div className="flex items-center mb-8">
          <span className="text-2xl font-extrabold text-white tracking-wide">TALENTO <span className="text-cyan-400">AI</span></span>
        </div>
        <div className="mb-8 flex flex-col items-center w-full">
          <img src={photoUrl || "/avatar1.jpg"} alt="User Avatar" className="w-20 h-20 rounded-full border-2 border-cyan-400 object-cover shadow-lg mb-2" />
          <h2 className="text-xl font-bold text-cyan-400 mb-1">{form.name || getInitials(form.name, form.email)}</h2>
          <p className="text-gray-400 text-sm">{form.email}</p>
          <label className="mt-2 bg-cyan-400 hover:bg-cyan-300 text-black rounded-full px-4 py-1 shadow-lg cursor-pointer border-2 border-white transition-all duration-200 flex items-center justify-center text-xs font-semibold" title="Change Photo">
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
            {uploading ? 'Uploading...' : 'Change Photo'}
          </label>
        </div>
        <nav className="flex flex-col gap-2 mt-8">
          <a href="/dashboard" className="px-4 py-2 rounded-lg text-white hover:bg-cyan-900 transition font-semibold">Dashboard</a>
          <a href="/profile" className="px-4 py-2 rounded-lg bg-cyan-400 text-black font-bold shadow hover:bg-cyan-300 transition">Profile</a>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 mt-8 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg">
            <FiLogOut className="text-lg" /> <span className="text-gray-100">Logout</span>
          </button>
        </nav>
      </aside>
      {/* Main profile info */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">My Profile</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Name */}
            <div className="flex flex-col items-start">
              <span className="text-gray-400 text-xs mb-1">Name</span>
              <div className="flex items-center gap-2">
                <span className="text-white text-2xl font-semibold">{form.name}</span>
                {editField === 'name' ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg bg-[#101113] text-white border border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-lg"
                    />
                    <button type="button" onClick={() => handleSave('name')} className="text-cyan-400 hover:text-cyan-300"><FiCheck /></button>
                    <button type="button" onClick={handleCancel} className="text-red-400 hover:text-red-300"><FiX /></button>
                  </>
                ) : (
                  <button type="button" onClick={() => handleEdit('name')} className="text-cyan-400 hover:text-cyan-300" title="Edit Name"><FiEdit2 /></button>
                )}
              </div>
            </div>
            {/* Email */}
            <div className="flex flex-col items-start">
              <span className="text-gray-400 text-xs mb-1">Email</span>
              <div className="flex items-center gap-2">
                <span className="text-white text-2xl font-semibold">{form.email}</span>
                {editField === 'email' ? (
                  <>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg bg-[#101113] text-white border border-cyan-500 focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-lg"
                    />
                    <button type="button" onClick={() => handleSave('email')} className="text-cyan-400 hover:text-cyan-300"><FiCheck /></button>
                    <button type="button" onClick={handleCancel} className="text-red-400 hover:text-red-300"><FiX /></button>
                  </>
                ) : (
                  <button type="button" onClick={() => handleEdit('email')} className="text-cyan-400 hover:text-cyan-300" title="Edit Email"><FiEdit2 /></button>
                )}
              </div>
            </div>
          </div>
          {(error || success) && (
            <div className="mt-8 w-full">
              {error && <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-2 text-center animate-fade-in">{error}</div>}
              {success && <div className="bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 px-4 py-3 rounded-lg text-sm mb-2 text-center animate-fade-in">{success}</div>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 