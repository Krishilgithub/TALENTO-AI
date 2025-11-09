// Simple Assessment Storage Utilities
import createClientForBrowser from '@/utils/supabase/client';

export class AssessmentDataStore {
  constructor() {
    this.supabase = createClientForBrowser();
    this.sessionData = {
      startTime: null,
      responses: [],
      jobRole: null,
      assessmentType: null
    };
  }

  // Start a new assessment session
  async startSession(assessmentType, jobRole = null) {
    this.sessionData = {
      startTime: new Date(),
      responses: [],
      jobRole,
      assessmentType
    };
    
    return true;
  }

  // Record a question response
  recordResponse({
    questionNumber,
    questionText,
    questionOptions,
    userAnswer,
    correctAnswer,
    isCorrect,
    timeTaken,
    category = null
  }) {
    const response = {
      questionNumber,
      questionText,
      questionOptions,
      userAnswer,
      correctAnswer,
      isCorrect,
      timeTaken,
      category,
      answeredAt: new Date()
    };

    this.sessionData.responses.push(response);
    return response;
  }

  // Complete and save the session
  async completeSession(userId) {
    if (!this.sessionData.responses.length) {
      throw new Error('No responses to save.');
    }

    const totalQuestions = this.sessionData.responses.length;
    const correctAnswers = this.sessionData.responses.filter(r => r.isCorrect).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const totalTime = Math.floor((new Date() - this.sessionData.startTime) / 1000);
    
    // Determine level based on score
    let level = 'Beginner';
    if (score >= 80) level = 'Expert';
    else if (score >= 60) level = 'Intermediate';
    else if (score >= 40) level = 'Novice';

    try {
      // Insert assessment result
      const { data: resultData, error: resultError } = await this.supabase
        .from('assessment_results')
        .insert([{
          user_id: userId,
          assessment_type: this.sessionData.assessmentType,
          job_role: this.sessionData.jobRole,
          score: score,
          level: level,
          number_of_questions: totalQuestions,
          correct_answers: correctAnswers,
          time_taken: totalTime,
          questions_data: this.sessionData.responses,
          completed_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (resultError) throw resultError;

      // Reset session
      this.sessionData = {
        startTime: null,
        responses: [],
        jobRole: null,
        assessmentType: null
      };

      return {
        success: true,
        data: resultData,
        score,
        level,
        totalQuestions,
        correctAnswers,
        totalTime
      };

    } catch (error) {
      console.error('Error completing assessment session:', error);
      throw error;
    }
  }

  // Get current session progress
  getProgress() {
    const totalQuestions = this.sessionData.responses.length;
    const correctAnswers = this.sessionData.responses.filter(r => r.isCorrect).length;
    
    return {
      totalQuestions,
      correctAnswers,
      accuracy: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
      responses: this.sessionData.responses
    };
  }
}

// Helper functions for simple assessment data retrieval
export async function getUserAssessmentResults(userId) {
  const supabase = createClientForBrowser();
  
  const { data, error } = await supabase
    .from('assessment_results')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getUserProgress(userId) {
  const supabase = createClientForBrowser();
  
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getAssessmentStats(userId) {
  const supabase = createClientForBrowser();
  
  // Get assessment results
  const { data: results, error: resultError } = await supabase
    .from('assessment_results')
    .select('assessment_type, job_role, score, level, number_of_questions, correct_answers, completed_at')
    .eq('user_id', userId);
  
  if (resultError) throw resultError;
  
  // Get progress data
  const { data: progress, error: progressError } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);
  
  if (progressError) throw progressError;
  
  return {
    results: results || [],
    progress: progress || []
  };
}

// Simple assessment result storage function
export async function storeAssessmentResult({
  userId, 
  assessmentType, 
  score, 
  level, 
  numQuestions,
  jobRole = null,
  responses = []
}) {
  const supabase = createClientForBrowser();
  
  // Calculate correct answers
  const correctAnswers = responses.filter(r => r.isCorrect).length;
  
  // Store in assessment_results table
  const { data, error } = await supabase
    .from('assessment_results')
    .insert([{
      user_id: userId,
      assessment_type: assessmentType,
      job_role: jobRole,
      score,
      level,
      number_of_questions: numQuestions,
      correct_answers: correctAnswers,
      questions_data: responses,
      completed_at: new Date().toISOString()
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  return { 
    success: true, 
    data, 
    score, 
    level,
    correctAnswers,
    totalQuestions: numQuestions
  };
}