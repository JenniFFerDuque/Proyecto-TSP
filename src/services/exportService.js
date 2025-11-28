import { toast } from '@/components/ui/use-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToExcel = (survey, responses, dateRange) => {
  let filteredResponses = responses;
  if (dateRange && dateRange.from && dateRange.to) {
    filteredResponses = responses.filter(r => {
      const submittedAt = new Date(r.submitted_at);
      return submittedAt >= dateRange.from && submittedAt <= dateRange.to;
    });
  }
  
  if (filteredResponses.length === 0) {
    toast({ title: "No data to export", description: "There are no responses in the selected date range.", variant: "destructive" });
    return;
  }

  const data = [];
  filteredResponses.forEach(response => {
    survey.questions.forEach(question => {
      data.push({
        'Respondent Email': response.user_email,
        'Submitted At': new Date(response.submitted_at).toLocaleString(),
        'Question': question.question_text,
        'Answer': response.response_data[question.id] || 'N/A',
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Survey Responses');
  XLSX.writeFile(workbook, `${survey.title.replace(/\s+/g, '_')}_Responses.xlsx`);
};


export const exportToPDF = (survey, responses, dateRange) => {
  let filteredResponses = responses;
  if (dateRange && dateRange.from && dateRange.to) {
    filteredResponses = responses.filter(r => {
      const submittedAt = new Date(r.submitted_at);
      return submittedAt >= dateRange.from && submittedAt <= dateRange.to;
    });
  }

  if (filteredResponses.length === 0) {
    toast({ title: "No data to export", description: "There are no responses in the selected date range.", variant: "destructive" });
    return;
  }
  
  const doc = new jsPDF();

  // Title and Description
  doc.setFontSize(18);
  doc.text(survey.title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(survey.description, 14, 30);

  // Stats
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Total Responses: ${filteredResponses.length}`, 14, 45);

  let y = 55;

  survey.questions.forEach((q, index) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`${index + 1}. ${q.question_text}`, 14, y);
    y += 7;

    doc.setFont(undefined, 'normal');
    
    if (q.question_type === 'multiple_choice') {
      const counts = {};
      q.options.forEach(opt => counts[opt] = 0);
      filteredResponses.forEach(r => {
        const answer = r.response_data[q.id];
        if (answer && counts[answer] !== undefined) {
          counts[answer]++;
        }
      });
      
      const tableData = q.options.map(opt => [opt, `${counts[opt]}`, `${filteredResponses.length > 0 ? ((counts[opt] / filteredResponses.length) * 100).toFixed(1) : 0}%`]);
      doc.autoTable({
        startY: y,
        head: [['Option', 'Count', 'Percentage']],
        body: tableData,
        theme: 'grid'
      });
      y = doc.autoTable.previous.finalY + 10;
    } else if (q.question_type === 'rating') {
      const ratings = filteredResponses.map(r => parseInt(r.response_data[q.id])).filter(r => !isNaN(r));
      const avg = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'N/A';
      doc.text(`Average Rating: ${avg} / 5`, 14, y);
      y += 10;
    } else if (q.question_type === 'text') {
        const textResponses = filteredResponses.map(r => r.response_data[q.id]).filter(Boolean);
        if (textResponses.length > 0) {
             doc.autoTable({
                startY: y,
                head: [['Text Responses']],
                body: textResponses.slice(0, 5).map(r => [r]), // limit to 5 for preview
                theme: 'grid'
            });
            y = doc.autoTable.previous.finalY + 10;
            if(textResponses.length > 5) {
                doc.setFontSize(9);
                doc.setTextColor(100);
                doc.text(`...and ${textResponses.length - 5} more responses.`, 14, y);
                 y += 10;
            }
        } else {
            doc.text('No text responses.', 14, y);
            y += 10;
        }
    }
  });

  doc.save(`${survey.title.replace(/\s+/g, '_')}_Report.pdf`);
};