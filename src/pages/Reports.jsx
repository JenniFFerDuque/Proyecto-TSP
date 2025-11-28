import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSurvey } from '@/contexts/SurveyContext';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, TrendingUp, Users } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const Reports = () => {
  const { surveys, responses } = useSurvey();
  const { user } = useAuth();

  const mySurveys = surveys.filter(s => s.created_by === user.id);

  const getResponseCount = (surveyId) => {
    return responses.filter(r => r.survey_id === surveyId).length;
  };

  const getResponseRate = (surveyId) => {
    const count = getResponseCount(surveyId);
    return count > 0 ? `${count} responses` : 'No responses yet';
  };

  return (
    <>
      <Helmet>
        <title>Reports - SurveyHub</title>
        <meta name="description" content="View detailed reports and analytics for your surveys" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link to="/admin">
              <Button variant="ghost" className="text-slate-400 hover:text-white mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Survey Reports
            </h1>
            <p className="text-slate-400">View detailed analytics for all your surveys</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Surveys</p>
                  <p className="text-3xl font-bold text-white mt-1">{mySurveys.length}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Responses</p>
                  <p className="text-3xl font-bold text-white mt-1">{responses.length}</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Completion Rate</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {mySurveys.length > 0 ? Math.round((responses.length / mySurveys.length) * 100) : 0}%
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">Survey Analytics</h2>
            </div>
            
            <div className="divide-y divide-slate-700">
              {mySurveys.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">No surveys available</p>
                  <p className="text-slate-500 mt-2">Create a survey to see reports</p>
                </div>
              ) : (
                mySurveys.map((survey, index) => (
                  <motion.div
                    key={survey.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{survey.title}</h3>
                        <p className="text-slate-400 mb-3">{survey.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center text-slate-500">
                            <FileText className="h-4 w-4 mr-1" />
                            {survey.questions.length} questions
                          </div>
                          <div className="flex items-center text-blue-400">
                            <Users className="h-4 w-4 mr-1" />
                            {getResponseRate(survey.id)}
                          </div>
                        </div>
                      </div>
                      <Link to={`/admin/reports/${survey.id}`}>
                        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Reports;