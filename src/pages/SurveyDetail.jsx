import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useSurvey } from '@/contexts/SurveyContext';
import { exportToExcel, exportToPDF } from '@/services/exportService';
import { motion } from 'framer-motion';
import { ArrowLeft, Download } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';

const SurveyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { surveys, getSurveyResponses } = useSurvey();

  const survey = surveys.find(s => s.id === id);
  const responses = getSurveyResponses(id);

  if (!survey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-slate-400">Survey not found</p>
        </div>
      </div>
    );
  }

  const downloadExcel = () => {
    exportToExcel(survey, responses);
  };

  const downloadPDF = () => {
    exportToPDF(survey, responses);
  };

  const getQuestionStats = (question) => {
    const questionResponses = responses.map(r => r.response_data[question.id]);
    
    if (question.question_type === 'multiple_choice') {
      const counts = {};
      question.options.forEach(opt => counts[opt] = 0);
      questionResponses.forEach(resp => {
        if (resp && counts[resp] !== undefined) counts[resp]++;
      });
      return counts;
    } else if (question.question_type === 'rating') {
      const ratings = questionResponses.map(r => r && parseInt(r)).filter(r => !isNaN(r));
      const avg = ratings.length > 0 
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : 0;
      return { average: avg, count: ratings.length };
    } else {
      return questionResponses.filter(r => r);
    }
  };

  return (
    <>
      <Helmet>
        <title>{survey.title} - Survey Details - SurveyHub</title>
        <meta name="description" content={`View detailed responses and analytics for ${survey.title}`} />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              onClick={() => navigate('/admin/reports')}
              variant="ghost"
              className="text-slate-400 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {survey.title}
                </h1>
                <p className="text-slate-400">{survey.description}</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={downloadExcel}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button
                  onClick={downloadPDF}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-slate-400 text-sm">Total Responses</p>
                <p className="text-3xl font-bold text-white mt-1">{responses.length}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Questions</p>
                <p className="text-3xl font-bold text-white mt-1">{survey.questions.length}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Created</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {new Date(survey.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            {survey.questions.map((question, index) => {
              const stats = getQuestionStats(question);
              
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 font-semibold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{question.question_text}</h3>
                      <p className="text-sm text-slate-400 capitalize">{question.question_type.replace('_', ' ')}</p>
                    </div>
                  </div>

                  {question.question_type === 'multiple_choice' && (
                    <div className="space-y-3 mt-4">
                      {Object.entries(stats).map(([option, count]) => {
                        const totalResponsesForQuestion = Object.values(stats).reduce((sum, current) => sum + current, 0);
                        const percentage = totalResponsesForQuestion > 0 
                          ? Math.round((count / totalResponsesForQuestion) * 100)
                          : 0;
                        
                        return (
                          <div key={option} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-300">{option}</span>
                              <span className="text-slate-400">{count} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {question.question_type === 'rating' && (
                    <div className="mt-4">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-blue-400">{stats.average}</p>
                          <p className="text-sm text-slate-400">Average Rating</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-300">{stats.count} responses</p>
                          <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map(star => (
                              <div
                                key={star}
                                className={`w-8 h-8 rounded ${
                                  star <= Math.round(stats.average)
                                    ? 'bg-yellow-500'
                                    : 'bg-slate-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {question.question_type === 'text' && (
                    <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                      {stats.length === 0 ? (
                        <p className="text-slate-400 italic">No responses yet</p>
                      ) : (
                        stats.map((response, idx) => (
                          <div key={idx} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                            <p className="text-slate-300">{response}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SurveyDetail;