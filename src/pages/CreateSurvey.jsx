import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSurvey } from '@/contexts/SurveyContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const CreateSurvey = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const { createSurvey } = useSurvey();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        question_text: '',
        question_type: 'multiple_choice',
        options: ['', ''],
        order: questions.length
      }
    ]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const addOption = (questionId) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, options: [...q.options, ''] } : q
    ));
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
        : q
    ));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: q.options.map((opt, i) => i === optionIndex ? value : opt)
          }
        : q
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (questions.length === 0) {
      toast({
        title: "No questions added",
        description: "Please add at least one question to your survey",
        variant: "destructive",
      });
      return;
    }

    const result = createSurvey({
      title,
      description,
      created_by: user.id,
      questions
    });

    if (result.success) {
      toast({
        title: "Survey created!",
        description: "Your survey has been created successfully",
      });
      navigate('/admin');
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Survey - SurveyHub</title>
        <meta name="description" content="Create a new survey with custom questions and options" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              onClick={() => navigate('/admin')}
              variant="ghost"
              className="text-slate-400 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Create New Survey
            </h1>
            <p className="text-slate-400">Design your survey with custom questions</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Survey Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Survey Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500"
                    placeholder="Enter survey title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 resize-none"
                    rows="3"
                    placeholder="Describe your survey"
                    required
                  />
                </div>
              </div>
            </motion.div>

            <div className="space-y-4">
              {questions.map((question, qIndex) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Question {qIndex + 1}</h3>
                    <Button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Question Text
                      </label>
                      <input
                        type="text"
                        value={question.question_text}
                        onChange={(e) => updateQuestion(question.id, 'question_text', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500"
                        placeholder="Enter your question"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Question Type
                      </label>
                      <select
                        value={question.question_type}
                        onChange={(e) => updateQuestion(question.id, 'question_type', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      >
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="rating">Rating (1-5)</option>
                        <option value="text">Text Response</option>
                      </select>
                    </div>

                    {question.question_type === 'multiple_choice' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Options
                        </label>
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex gap-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500"
                                placeholder={`Option ${optIndex + 1}`}
                                required
                              />
                              {question.options.length > 2 && (
                                <Button
                                  type="button"
                                  onClick={() => removeOption(question.id, optIndex)}
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            onClick={() => addOption(question.id)}
                            variant="outline"
                            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              type="button"
              onClick={addQuestion}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 py-6"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Question
            </Button>

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => navigate('/admin')}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 py-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6"
              >
                <Save className="h-5 w-5 mr-2" />
                Create Survey
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateSurvey;