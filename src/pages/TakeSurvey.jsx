import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSurvey } from '@/contexts/SurveyContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Star } from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';

const TakeSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { surveys, submitResponse, hasUserCompletedSurvey } = useSurvey();
  const { user } = useAuth();
  const { toast } = useToast();

  const survey = surveys.find(s => s.id === id);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!survey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-slate-400">Survey not found</p>
        </div>
      </div>
    );
  }

  if (hasUserCompletedSurvey(id, user.id)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-12 border border-slate-700 text-center"
          >
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="h-10 w-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Already Completed</h2>
            <p className="text-slate-400 mb-6">You have already completed this survey. Thank you for your participation!</p>
            <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-purple-500 to-pink-500">
              Back to Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const allAnswered = survey.questions.every(q => answers[q.id]);
    
    if (!allAnswered) {
      toast({
        title: "Incomplete survey",
        description: "Please answer all questions before submitting",
        variant: "destructive",
      });
      return;
    }

    submitResponse(id, user.id, answers);
    setSubmitted(true);
    
    toast({
      title: "Survey submitted!",
      description: "Thank you for your feedback",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-12 border border-slate-700 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Send className="h-10 w-10 text-green-400" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-4">Thank You!</h2>
            <p className="text-slate-400 mb-6">Your response has been submitted successfully.</p>
            <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-purple-500 to-pink-500">
              Back to Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{survey.title} - Take Survey - SurveyHub</title>
        <meta name="description" content={survey.description} />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="text-slate-400 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {survey.title}
            </h1>
            <p className="text-slate-400">{survey.description}</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {survey.questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-purple-400 font-semibold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-4">{question.question_text}</h3>

                    {question.question_type === 'multiple_choice' && (
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <label
                            key={optIndex}
                            className="flex items-center p-4 bg-slate-900/50 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-700/30 transition-colors"
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option}
                              checked={answers[question.id] === option}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              className="w-4 h-4 text-purple-500 focus:ring-purple-500"
                            />
                            <span className="ml-3 text-slate-300">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {question.question_type === 'rating' && (
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => handleAnswerChange(question.id, rating.toString())}
                            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                              answers[question.id] === rating.toString()
                                ? 'border-yellow-500 bg-yellow-500/10'
                                : 'border-slate-700 bg-slate-900/50 hover:bg-slate-700/30'
                            }`}
                          >
                            <Star
                              className={`h-8 w-8 mx-auto ${
                                answers[question.id] === rating.toString()
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-slate-600'
                              }`}
                            />
                            <p className="text-sm text-slate-400 mt-2">{rating}</p>
                          </button>
                        ))}
                      </div>
                    )}

                    {question.question_type === 'text' && (
                      <textarea
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 resize-none"
                        rows="4"
                        placeholder="Type your answer here..."
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 text-lg"
            >
              <Send className="h-5 w-5 mr-2" />
              Submit Survey
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default TakeSurvey;