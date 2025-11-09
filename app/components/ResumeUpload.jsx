'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { saveResume, uploadResumeFile, extractTextFromFile } from '../../utils/resumeStorage';
import { FiUpload, FiFile, FiCheck, FiX, FiLoader } from 'react-icons/fi';

export default function ResumeUpload({ onUploadSuccess, onUploadError }) {
    const { user, supabase } = useAuth();
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file) => {
        if (!user) {
            setError('Please log in to upload resumes');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        try {
            // Upload file to storage
            const uploadResult = await uploadResumeFile(supabase, user.id, file);
            if (!uploadResult.success) {
                throw new Error(uploadResult.error);
            }

            // Extract text content from file
            const content = await extractTextFromFile(file);

            // Prepare resume data
            const resumeData = {
                user_id: user.id,
                filename: uploadResult.fileName,
                original_name: file.name,
                file_size: file.size,
                file_type: file.type,
                content: content
            };

            // Save to database
            const result = await saveResume(supabase, resumeData);

            if (result.success) {
                setSuccess('Resume uploaded successfully!');
                if (onUploadSuccess) {
                    onUploadSuccess(result.data);
                }

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccess('');
                }, 3000);
            } else {
                setError(result.error || 'Failed to save resume');
            }
        } catch (err) {
            const errorMessage = err.message || 'Failed to upload resume';
            setError(errorMessage);
            if (onUploadError) {
                onUploadError(errorMessage);
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${dragActive
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-gray-600 hover:border-gray-500'
                    } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                />

                <div className="text-center">
                    {uploading ? (
                        <FiLoader className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-spin" />
                    ) : (
                        <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    )}

                    <h3 className="text-lg font-semibold text-white mb-2">
                        {uploading ? 'Uploading...' : 'Upload Resume'}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4">
                        {uploading
                            ? 'Processing your resume...'
                            : 'Drag and drop your resume here, or click to select'
                        }
                    </p>

                    <p className="text-gray-500 text-xs">
                        Supports: PDF, DOC, DOCX, TXT files
                    </p>
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 flex items-center gap-2">
                    <FiCheck className="w-5 h-5" />
                    {success}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-center gap-2">
                    <FiX className="w-5 h-5" />
                    {error}
                </div>
            )}
        </div>
    );
}