import { createContext, useContext, useEffect, useState } from 'react';

const SurveyContext = createContext(null);

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within SurveyProvider');
  }
  return context;
};

export const SurveyProvider = ({ children }) => {
  const [surveys, setSurveys] = useState([]);
  const [responses, setResponses] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    setSurveys(JSON.parse(localStorage.getItem('surveys') || '[]'));
    setResponses(JSON.parse(localStorage.getItem('survey_responses') || '[]'));
    setLinks(JSON.parse(localStorage.getItem('survey_links') || '[]'));
  }, []);

  const createSurvey = (surveyData) => {
    const newSurvey = {
      id: Date.now().toString(),
      ...surveyData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const updatedSurveys = [...surveys, newSurvey];
    setSurveys(updatedSurveys);
    localStorage.setItem('surveys', JSON.stringify(updatedSurveys));
    return { success: true, survey: newSurvey };
  };

  const updateSurvey = (surveyId, surveyData) => {
    const updatedSurveys = surveys.map(s => s.id === surveyId ? { ...s, ...surveyData, updated_at: new Date().toISOString() } : s);
    setSurveys(updatedSurveys);
    localStorage.setItem('surveys', JSON.stringify(updatedSurveys));
    return { success: true };
  };

  const deleteSurvey = (surveyId) => {
    const updatedSurveys = surveys.filter(s => s.id !== surveyId);
    setSurveys(updatedSurveys);
    localStorage.setItem('surveys', JSON.stringify(updatedSurveys));
    
    // Also delete related responses and links
    const updatedResponses = responses.filter(r => r.survey_id !== surveyId);
    setResponses(updatedResponses);
    localStorage.setItem('survey_responses', JSON.stringify(updatedResponses));

    const updatedLinks = links.filter(l => l.survey_id !== surveyId);
    setLinks(updatedLinks);
    localStorage.setItem('survey_links', JSON.stringify(updatedLinks));

    return { success: true };
  };

  const submitResponse = (surveyId, userEmail, responseData) => {
    const newResponse = {
      id: Date.now().toString(),
      survey_id: surveyId,
      user_email: userEmail,
      response_data: responseData,
      submitted_at: new Date().toISOString()
    };
    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    localStorage.setItem('survey_responses', JSON.stringify(updatedResponses));
    return { success: true };
  };
  
  const generateSurveyLinks = async (surveyId) => {
      const long_link = `${window.location.origin}/survey/${surveyId}`;
      // Basic URL shortener simulation
      const short_link = `https://tiny.url/survey-${surveyId.slice(-6)}`;
      // QR code generation would need a library, but we can simulate the data
      const qr_code = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">QR</text></svg>`)}`;

      const newLink = {
          id: Date.now().toString(),
          survey_id: surveyId,
          long_link,
          short_link,
          qr_code,
          created_at: new Date().toISOString(),
      };
      
      const updatedLinks = [...links.filter(l => l.survey_id !== surveyId), newLink];
      setLinks(updatedLinks);
      localStorage.setItem('survey_links', JSON.stringify(updatedLinks));
      return { success: true, links: newLink };
  };

  const getSurveyLinks = (surveyId) => links.find(l => l.survey_id === surveyId);

  const getSurveyResponses = (surveyId) => responses.filter(r => r.survey_id === surveyId);

  // This function is for the old user system, might need update for anonymous survey takers
  const hasUserCompletedSurvey = (surveyId, userId) => {
    return responses.some(r => r.survey_id === surveyId && r.user_id === userId);
  };

  return (
    <SurveyContext.Provider value={{
      surveys,
      responses,
      createSurvey,
      updateSurvey,
      deleteSurvey,
      submitResponse,
      getSurveyResponses,
      hasUserCompletedSurvey,
      generateSurveyLinks,
      getSurveyLinks
    }}>
      {children}
    </SurveyContext.Provider>
  );
};