import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSurvey } from '@/contexts/SurveyContext';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { surveys, hasUserCompletedSurvey } = useSurvey();
  const { user } = useAuth();

  const completedCount = surveys.filter(s => hasUserCompletedSurvey(s.id, user.id)).length;
  const pendingCount = surveys.length - completedCount;

  return (
    <>
      <Helmet>
        <title>User Dashboard - SurveyHub</title>
        <meta name="description" content="View and complete available surveys" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              My Surveys
            </h1>
            <p className="text-slate-400">Complete surveys and share your feedback</p>
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
                  <p className="text-slate-400 text-sm">Available Surveys</p>
                  <p className="text-3xl font-bold text-white mt-1">{surveys.length}</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <FileText className="h-8 w-8 text-purple-400" />
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
                  <p className="text-slate-400 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-white mt-1">{completedCount}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-400" />
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
                  <p className="text-slate-400 text-sm">Pending</p>
                  <p className="text-3xl font-bold text-white mt-1">{pendingCount}</p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Clock className="h-8 w-8 text-orange-400" />
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
              <h2 className="text-2xl font-bold text-white">Available Surveys</h2>
            </div>
            
            <div className="divide-y divide-slate-700">
              {surveys.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">No surveys available</p>
                  <p className="text-slate-500 mt-2">Check back later for new surveys</p>
                </div>
              ) : (
                surveys.map((survey, index) => {
                  const isCompleted = hasUserCompletedSurvey(survey.id, user.id);
                  
                  return (
                    <motion.div
                      key={survey.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-white">{survey.title}</h3>
                            {isCompleted ? (
                              <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20">
                                Completed
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs font-medium rounded-full border border-orange-500/20">
                                Pending
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 mb-3">{survey.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(survey.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-1" />
                              {survey.questions.length} questions
                            </div>
                          </div>
                        </div>
                        {!isCompleted && (
                          <Link to={`/survey/${survey.id}`}>
                            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                              Start Survey
                            </Button>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;