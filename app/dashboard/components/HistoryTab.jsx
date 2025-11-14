'use client';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { useAuth } from '../../context/AuthContext';
import {
    FiFile,
    FiCalendar,
    FiEye,
    FiDownload,
    FiTrash2,
    FiEdit3,
    FiTarget,
    FiTrendingUp,
    FiRefreshCw,
    FiClock
} from 'react-icons/fi';

export default function HistoryTab() {
    const { user, supabase } = useAuth();
    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState(null);
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Enhanced text formatting function for better display (same as OverviewTab)
    const formatResultText = (text) => {
        if (!text || typeof text !== 'string') return null;

        // Clean the text first - remove markdown symbols and extra formatting
        const cleanText = text
            .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove **bold** markers
            .replace(/\*([^*]+)\*/g, '$1')      // Remove *italic* markers
            .replace(/#+\s*/g, '')              // Remove ### markers
            .replace(/\n\s*\n\s*\n/g, '\n\n')  // Clean extra line breaks

        // Split into logical sections using emojis and patterns
        const sections = cleanText.split(/(?=🔍|✅|⚠️|🚀|📈|🎯|PRIORITY \d+)/);

        return sections.map((section, index) => {
            if (!section.trim()) return null;

            const lines = section.trim().split('\n').filter(line => line.trim());
            if (lines.length === 0) return null;

            const title = lines[0].trim();
            const content = lines.slice(1);

            // Determine section type and styling
            let headerClass = "text-lg font-bold mb-3";
            let containerClass = "mb-6 p-4 rounded-lg border";

            if (title.includes('🔍') || title.includes('EXTRACTED')) {
                headerClass = "text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3";
                containerClass += " bg-blue-900/20 border-blue-500/30";
            } else if (title.includes('✅') || title.includes('STRENGTHS')) {
                headerClass = "text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3";
                containerClass += " bg-green-900/20 border-green-500/30";
            } else if (title.includes('⚠️') || title.includes('IMPROVEMENT')) {
                headerClass = "text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-3";
                containerClass += " bg-yellow-900/20 border-yellow-500/30";
            } else if (title.includes('🚀') || title.includes('OPTIMIZATION')) {
                headerClass = "text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3";
                containerClass += " bg-purple-900/20 border-purple-500/30";
            } else if (title.includes('📈') || title.includes('ATS') || title.includes('SCORE')) {
                headerClass = "text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3";
                containerClass += " bg-indigo-900/20 border-indigo-500/30";
            } else if (title.includes('🎯') || title.includes('NEXT STEPS')) {
                headerClass = "text-lg font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent mb-3";
                containerClass += " bg-pink-900/20 border-pink-500/30";
            } else if (title.includes('PRIORITY')) {
                headerClass = "text-md font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-3";
                containerClass += " bg-orange-900/20 border-orange-500/30";
            } else {
                containerClass += " bg-gray-800/30 border-gray-600/40";
            }

            return (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className={containerClass}
                >
                    {/* Section Title */}
                    <h4 className={headerClass}>
                        {title}
                    </h4>

                    {/* Section Content */}
                    <div className="space-y-3">
                        {content.map((line, lineIndex) => {
                            const cleanLine = line.trim();
                            if (!cleanLine) return null;

                            // Format different types of content
                            if (cleanLine.startsWith('•') || cleanLine.match(/^\d+\./) || cleanLine.startsWith('-')) {
                                // Bullet points and numbered lists
                                return (
                                    <motion.div
                                        key={lineIndex}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: (index * 0.1) + (lineIndex * 0.05), duration: 0.3 }}
                                        className="flex items-start gap-2 py-1 px-2 rounded hover:bg-gray-700/30 transition-colors duration-150"
                                    >
                                        <span className="text-cyan-400 text-sm mt-0.5 flex-shrink-0">
                                            {cleanLine.startsWith('•') ? '•' : cleanLine.match(/^\d+\./) ? '▸' : '→'}
                                        </span>
                                        <span className="text-gray-200 leading-relaxed text-sm">
                                            {cleanLine.replace(/^[•\d+\.\-]\s*/, '').trim()}
                                        </span>
                                    </motion.div>
                                );
                            } else if (cleanLine.includes(':') && !cleanLine.includes('http') && cleanLine.length < 100) {
                                // Key-value pairs
                                const [key, ...valueParts] = cleanLine.split(':');
                                const value = valueParts.join(':').trim();
                                return (
                                    <div key={lineIndex} className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 px-2 rounded bg-gray-800/40 border-l-2 border-cyan-500/50">
                                        <span className="font-semibold text-gray-200 text-sm">{key.trim()}</span>
                                        <span className="md:col-span-2 text-gray-300 text-sm leading-relaxed">{value}</span>
                                    </div>
                                );
                            } else {
                                // Regular paragraphs
                                return (
                                    <motion.p
                                        key={lineIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: (index * 0.1) + (lineIndex * 0.05), duration: 0.3 }}
                                        className="text-gray-200 leading-relaxed text-sm px-2 py-1"
                                    >
                                        {cleanLine}
                                    </motion.p>
                                );
                            }
                        })}
                    </div>
                </motion.div>
            );
        }).filter(Boolean);
    };

    useEffect(() => {
        if (user) {
            fetchResumes();
        }
    }, [user]);

    useEffect(() => {
        if (selectedResume) {
            fetchAnalyses(selectedResume.id);
        }
    }, [selectedResume]);

    const fetchResumes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('resumes')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setResumes(data || []);
        } catch (error) {
            console.error('Error fetching resumes:', error);
            setError('Failed to load resumes');
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalyses = async (resumeId) => {
        try {
            console.log('Fetching analyses for resume ID:', resumeId);
            const { data, error } = await supabase
                .from('resume_analyses')
                .select('*')
                .eq('resume_id', resumeId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            console.log('Fetched analyses:', data);
            console.log('Analysis data structure:', data?.map(a => ({
                id: a.id,
                type: a.analysis_type,
                hasScore: !!a.score,
                hasFeedback: !!a.feedback,
                hasSuggestions: !!a.suggestions,
                suggestionsType: typeof a.suggestions,
                suggestionsKeys: a.suggestions ? Object.keys(a.suggestions) : null
            })));
            setAnalyses(data || []);
        } catch (error) {
            console.error('Error fetching analyses:', error);
            setAnalyses([]);
        }
    };

    const handleViewResume = async (resume) => {
        try {
            // Check for file path in both possible field names
            const filePath = resume.file_path || resume.filename;
            
            if (!filePath) {
                const errorMsg = 'No file path found for resume. Please re-upload the resume.';
                console.error(errorMsg);
                setError(errorMsg);
                setTimeout(() => setError(''), 5000);
                return;
            }

            // Get the file from storage
            const { data, error } = await supabase.storage
                .from('resumes')
                .download(filePath);

            if (error) throw error;

            const blob = new Blob([data], { type: resume.file_type });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error viewing resume:', error);
            setError(`Failed to view resume: ${error.message}`);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleDownloadResume = async (resume) => {
        try {
            // Check for file path in both possible field names
            const filePath = resume.file_path || resume.filename;
            
            if (!filePath) {
                const errorMsg = 'No file path found for resume. Please re-upload the resume.';
                console.error(errorMsg);
                setError(errorMsg);
                setTimeout(() => setError(''), 5000);
                return;
            }

            // Get the file from storage
            const { data, error } = await supabase.storage
                .from('resumes')
                .download(filePath);

            if (error) throw error;

            const blob = new Blob([data], { type: resume.file_type });
            const url = URL.createObjectURL(blob);

            // Create a temporary link to download
            const link = document.createElement('a');
            link.href = url;
            link.download = resume.original_name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading resume:', error);
            setError(`Failed to download resume: ${error.message}`);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleDeleteResume = async (resumeId) => {
        if (confirm('Are you sure you want to delete this resume?')) {
            try {
                const { error } = await supabase
                    .from('resumes')
                    .delete()
                    .eq('id', resumeId);

                if (error) throw error;

                setResumes(resumes.filter(r => r.id !== resumeId));
                if (selectedResume?.id === resumeId) {
                    setSelectedResume(null);
                    setAnalyses([]);
                }
            } catch (error) {
                console.error('Error deleting resume:', error);
            }
        }
    };

    const getAnalysisIcon = (type) => {
        switch (type) {
            case 'ats_score':
                return <FiTarget className="w-4 h-4" />;
            case 'optimization':
                return <FiTrendingUp className="w-4 h-4" />;
            default:
                return <FiRefreshCw className="w-4 h-4" />;
        }
    };

    const getAnalysisColor = (type) => {
        switch (type) {
            case 'ats_score':
                return 'border-blue-600 bg-blue-600/20 text-blue-400';
            case 'optimization':
                return 'border-green-600 bg-green-600/20 text-green-400';
            default:
                return 'border-purple-600 bg-purple-600/20 text-purple-400';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-64">
                        <FiRefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Resume List */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white">
                                    Resume History ({resumes.length})
                                </h2>
                                <div className="text-sm text-gray-400">
                                    {analyses.length} analyses
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-4 bg-red-600/20 border border-red-600/50 rounded-lg text-red-400">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3">
                                {resumes.length === 0 ? (
                                    <div className="text-center py-8">
                                        <FiFile className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                        <p className="text-gray-400">No resumes uploaded yet</p>
                                        <p className="text-gray-500 text-sm mt-2">
                                            Upload a resume in the Overview tab to get started
                                        </p>
                                    </div>
                                ) : (
                                    resumes.map((resume) => (
                                        <div
                                            key={resume.id}
                                            onClick={() => setSelectedResume(resume)}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:border-cyan-400/50 ${selectedResume?.id === resume.id
                                                ? 'border-cyan-400/50 bg-cyan-400/10'
                                                : 'border-gray-600/50 bg-gray-800/30'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center mb-2">
                                                        <FiFile className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" />
                                                        <p className="text-white font-medium truncate">
                                                            {resume.original_name}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center text-gray-400 text-xs mb-1">
                                                        <FiCalendar className="w-3 h-3 mr-1" />
                                                        {new Date(resume.created_at).toLocaleDateString()}
                                                    </div>

                                                    <div className="text-gray-500 text-xs">
                                                        {(resume.file_size / 1024).toFixed(1)} KB • {new Date(resume.upload_date).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteResume(resume.id);
                                                    }}
                                                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Area - Resume Details and Analysis */}
                    <div className="lg:col-span-2">
                        {selectedResume ? (
                            <div className="space-y-6">
                                {/* Resume Details */}
                                <div className="bg-gray-800/30 border border-gray-600/50 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold text-white">
                                            {selectedResume.original_name}
                                        </h2>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewResume(selectedResume)}
                                                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                                            >
                                                <FiEye className="w-4 h-4" />
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDownloadResume(selectedResume)}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                                            >
                                                <FiDownload className="w-4 h-4" />
                                                Download
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">File Size:</span>
                                            <span className="text-white ml-2">{(selectedResume.file_size / 1024).toFixed(1)} KB</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Type:</span>
                                            <span className="text-white ml-2">{selectedResume.file_type}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Uploaded:</span>
                                            <span className="text-white ml-2">{new Date(selectedResume.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Analyses:</span>
                                            <span className="text-white ml-2">{analyses.length}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Analysis History */}
                                <div className="bg-gray-800/30 border border-gray-600/50 rounded-lg p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">
                                        Analysis History
                                    </h2>

                                    {analyses.length === 0 ? (
                                        <div className="text-center py-8">
                                            <FiTarget className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                            <p className="text-gray-400">No analyses yet for this resume</p>
                                            <p className="text-gray-500 text-sm mt-2">
                                                Go to Overview tab and run ATS analysis or optimization to see results here
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {analyses.map((analysis) => (
                                                <div
                                                    key={analysis.id}
                                                    className="bg-gray-800/30 border border-gray-600/50 rounded-lg p-6"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg border ${getAnalysisColor(analysis.analysis_type)}`}>
                                                                {getAnalysisIcon(analysis.analysis_type)}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-white capitalize">
                                                                    {analysis.analysis_type.replace('_', ' ')} Analysis
                                                                </h3>
                                                                <div className="flex items-center text-gray-400 text-sm">
                                                                    <FiClock className="w-3 h-3 mr-1" />
                                                                    {new Date(analysis.created_at).toLocaleString()}
                                                                </div>
                                                                {analysis.suggestions?.job_role && (
                                                                    <div className="text-xs text-cyan-400 mt-1">
                                                                        For: {analysis.suggestions.job_role}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {analysis.score && (
                                                            <div className="text-right">
                                                                <div className="text-2xl font-bold text-cyan-400">
                                                                    {analysis.score}%
                                                                </div>
                                                                <div className="text-xs text-gray-400">ATS Score</div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {analysis.feedback && (
                                                        <div className="mb-4">
                                                            <h4 className="font-medium text-white mb-2">
                                                                {analysis.analysis_type === 'ats_score' ? 'Analysis:' : 'Feedback:'}
                                                            </h4>
                                                            <div className="space-y-4">
                                                                {formatResultText(analysis.feedback)}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {analysis.suggestions && (
                                                        <div className="mb-4">
                                                            <h4 className="font-medium text-white mb-2">Suggestions:</h4>
                                                            <div className="text-gray-300 bg-gray-800/50 p-3 rounded border space-y-3">
                                                                {typeof analysis.suggestions === 'string' ? (
                                                                    <div className="space-y-4">
                                                                        {formatResultText(analysis.suggestions)}
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        {analysis.suggestions.job_role && (
                                                                            <div>
                                                                                <span className="text-cyan-400 font-medium">Job Role:</span> {analysis.suggestions.job_role}
                                                                            </div>
                                                                        )}

                                                                        {analysis.suggestions.keywords && analysis.suggestions.keywords.length > 0 && (
                                                                            <div>
                                                                                <span className="text-cyan-400 font-medium">Keywords:</span>
                                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                                    {analysis.suggestions.keywords.map((keyword, idx) => (
                                                                                        <span key={idx} className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs">
                                                                                            {keyword}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {analysis.suggestions.improvements && analysis.suggestions.improvements.length > 0 && (
                                                                            <div>
                                                                                <span className="text-cyan-400 font-medium">Improvements:</span>
                                                                                <ul className="list-disc list-inside space-y-1 mt-1 text-sm">
                                                                                    {analysis.suggestions.improvements.map((improvement, idx) => (
                                                                                        <li key={idx}>{improvement}</li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}

                                                                        {analysis.suggestions.missing_skills && analysis.suggestions.missing_skills.length > 0 && (
                                                                            <div>
                                                                                <span className="text-red-400 font-medium">Missing Skills:</span>
                                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                                    {analysis.suggestions.missing_skills.map((skill, idx) => (
                                                                                        <span key={idx} className="bg-red-600/20 text-red-300 px-2 py-1 rounded text-xs">
                                                                                            {skill}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {analysis.suggestions.optimized_content && (
                                                                            <div>
                                                                                <span className="text-green-400 font-medium">Optimized Content:</span>
                                                                                <div className="mt-1 text-sm bg-gray-700/50 p-2 rounded max-h-40 overflow-y-auto whitespace-pre-wrap">
                                                                                    {analysis.suggestions.optimized_content}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {analysis.model_used && (
                                                        <div className="text-gray-500 text-xs">
                                                            Model: {analysis.model_used}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-800/30 border border-gray-600/50 rounded-lg p-12 text-center">
                                <FiFile className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg">Select a resume to view details</p>
                                <p className="text-gray-500 text-sm mt-2">
                                    Choose a resume from the list to see its content and analysis history
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}