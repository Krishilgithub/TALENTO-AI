// Enhanced Assessment Analytics and Visualization Components
import { useState, useEffect } from 'react';
import {
  getAssessmentStats
} from '@/utils/assessmentDataStore';

// Progress Charts Component
export function EnhancedProgressCharts({ userId }) {
  const [stats, setStats] = useState({ sessions: [], attempts: [], progress: [] });
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getAssessmentStats(userId);
        // Map the data structure to match what the component expects
        const cleanedResults = (data.results || []).map(session => ({
          ...session,
          // Ensure scores are within 0-100 range
          score: Math.min(Math.max(session.score || 0, 0), 100),
          // Validate question counts
          number_of_questions: session.number_of_questions || 5,
          correct_answers: session.correct_answers || 0
        }));

        console.log('Enhanced Progress Charts - Cleaned Data:', cleanedResults);

        setStats({
          sessions: cleanedResults,
          attempts: [], // We don't have attempts data in the simple schema
          progress: data.progress || []
        });
      } catch (error) {
        console.error('Error loading enhanced stats:', error);
        setStats({ sessions: [], attempts: [], progress: [] });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadStats();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const assessmentTypes = ['aptitude', 'technical', 'communication', 'personality'];
  const filteredSessions = selectedFilter === 'all'
    ? (stats?.sessions || [])
    : (stats?.sessions || []).filter(s => s?.assessment_type === selectedFilter);

  // Job Role Analysis - with proper null checking
  const jobRoleStats = (stats?.sessions || []).reduce((acc, session) => {
    if (session?.job_role) {
      if (!acc[session.job_role]) {
        acc[session.job_role] = { count: 0, totalScore: 0, types: new Set() };
      }
      acc[session.job_role].count++;
      acc[session.job_role].totalScore += (session.score || 0);
      acc[session.job_role].types.add(session.assessment_type || 'unknown');
    }
    return acc;
  }, {});

  // Difficulty Progression - using sessions data instead of attempts with null checking
  const difficultyProgress = (stats?.sessions || []).reduce((acc, session) => {
    if (session?.level && session?.assessment_type) {
      const key = `${session.assessment_type}-${session.level}`;
      if (!acc[key]) {
        acc[key] = { correct: 0, total: 0, type: session.assessment_type, difficulty: session.level };
      }
      acc[key].total++;
      // Use the actual correct answers from the database instead of calculating
      const correctCount = session.correct_answers || 0;
      acc[key].correct += correctCount;
    }
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'all'
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
          All Assessments
        </button>
        {assessmentTypes.map(type => (
          <button
            key={type}
            onClick={() => setSelectedFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${selectedFilter === type
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Score Trends */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Score Progression</h3>
        <div className="space-y-3">
          {filteredSessions.length === 0 ? (
            <p className="text-gray-400">No assessment data available for selected filter.</p>
          ) : (
            filteredSessions.map((session, index) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-white font-medium capitalize">{session.assessment_type}</p>
                    <p className="text-gray-400 text-sm">
                      {session.job_role && `${session.job_role} • `}
                      {new Date(session.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${session.score >= 80 ? 'text-green-400' :
                      session.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                    {Math.round(session.score)}%
                  </p>
                  <p className="text-gray-400 text-sm">{session.correct_answers || 0}/{session.number_of_questions || 0}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Job Role Performance */}
      {Object.keys(jobRoleStats).length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Performance by Job Role</h3>
          <div className="space-y-3">
            {Object.entries(jobRoleStats).map(([role, stats]) => (
              <div key={role} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                <div>
                  <p className="text-white font-medium">{role}</p>
                  <p className="text-gray-400 text-sm">
                    {stats.count} assessment{stats.count !== 1 ? 's' : ''} •
                    {Array.from(stats.types).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-cyan-400 font-bold">
                    {Math.round(stats.totalScore / stats.count)}% avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Performance */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(difficultyProgress).map((item) => {
            const accuracy = item.total > 0 ? (item.correct / item.total * 100) : 0;
            const uniqueKey = `${item.type}-${item.difficulty}`;
            return (
              <div key={uniqueKey} className="p-4 bg-gray-700 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-white font-medium capitalize">
                    {item.type} - {item.difficulty}
                  </h4>
                  <span className={`text-sm font-bold ${accuracy >= 80 ? 'text-green-400' :
                      accuracy >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                    {Math.round(accuracy)}%
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(accuracy, 100)}%` }}
                  />
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  {item.correct}/{item.total} questions correct
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-2">
          {(stats.sessions || []).slice(0, 5).map((session) => (
            <div key={session.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-300">
                Completed {session.assessment_type} assessment
                {session.job_role && ` for ${session.job_role}`}
              </span>
              <span className="text-gray-500">
                {new Date(session.completed_at).toLocaleDateString()}
              </span>
            </div>
          ))}
          {(stats.sessions || []).length === 0 && (
            <p className="text-gray-400 text-center py-8">
              No assessments completed yet. Start your first assessment above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}