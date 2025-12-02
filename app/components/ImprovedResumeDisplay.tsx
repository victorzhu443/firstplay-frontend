'use client';

import { ImprovedResume } from '@/types';
import { useState } from 'react';
import jsPDF from 'jspdf';

interface ImprovedResumeDisplayProps {
  improvedResume: ImprovedResume;
}

export default function ImprovedResumeDisplay({ improvedResume }: ImprovedResumeDisplayProps) {
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'latex'>('pdf');

  const generateLaTeX = (): string => {
    let latex = `\\documentclass[11pt,letterpaper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\pagestyle{empty}

\\begin{document}

\\begin{center}
{\\Large \\textbf{${improvedResume.name}}} \\\\
${improvedResume.contact}
\\end{center}

`;

    // Summary
    if (improvedResume.summary) {
      latex += `\\section*{SUMMARY}
${improvedResume.summary}

`;
    }

    // Skills
    latex += `\\section*{TECHNICAL SKILLS}
${improvedResume.skills.join(' $\\bullet$ ')}

`;

    // Experience
    if (improvedResume.experience.length > 0) {
      latex += `\\section*{EXPERIENCE}
`;
      improvedResume.experience.forEach(exp => {
        latex += `\\textbf{${exp.company}} -- ${exp.title} \\hfill ${exp.duration} \\\\
\\begin{itemize}[leftmargin=*,noitemsep]
`;
        exp.bullets.forEach(bullet => {
          latex += `  \\item ${bullet}\n`;
        });
        latex += `\\end{itemize}

`;
      });
    }

    // Projects
    if (improvedResume.projects.length > 0) {
      latex += `\\section*{PROJECTS}
`;
      improvedResume.projects.forEach(proj => {
        latex += `\\textbf{${proj.name}} | ${proj.technologies.join(', ')} \\\\
\\begin{itemize}[leftmargin=*,noitemsep]
`;
        proj.bullets.forEach(bullet => {
          latex += `  \\item ${bullet}\n`;
        });
        latex += `\\end{itemize}

`;
      });
    }

    // Education
    if (improvedResume.education.length > 0) {
      latex += `\\section*{EDUCATION}
`;
      improvedResume.education.forEach(edu => {
        if (typeof edu === 'string') {
          latex += `${edu} \\\\
`;
        } else {
          latex += `${edu.institution} -- ${edu.degree}, ${edu.graduation_date} \\\\
`;
        }
      });
    }

    latex += `\\end{document}`;
    return latex;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Helper to add text with wrapping
    const addText = (text: string, fontSize: number, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      if (isBold) doc.setFont('helvetica', 'bold');
      else doc.setFont('helvetica', 'normal');
      
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, margin, yPos);
        yPos += fontSize * 0.5;
      });
      yPos += 3;
    };

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(improvedResume.name, pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(improvedResume.contact, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Summary
    if (improvedResume.summary) {
      addText('SUMMARY', 12, true);
      addText(improvedResume.summary, 10);
      yPos += 5;
    }

    // Skills
    addText('TECHNICAL SKILLS', 12, true);
    addText(improvedResume.skills.join(' • '), 10);
    yPos += 5;

    // Experience
    if (improvedResume.experience.length > 0) {
      addText('EXPERIENCE', 12, true);
      improvedResume.experience.forEach(exp => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${exp.company} – ${exp.title}`, margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(exp.duration, pageWidth - margin, yPos, { align: 'right' });
        yPos += 5;
        
        exp.bullets.forEach(bullet => {
          addText(`• ${bullet}`, 9);
        });
        yPos += 3;
      });
    }

    // Projects
    if (improvedResume.projects.length > 0) {
      addText('PROJECTS', 12, true);
      improvedResume.projects.forEach(proj => {
        addText(`${proj.name} | ${proj.technologies.join(', ')}`, 10, true);
        proj.bullets.forEach(bullet => {
          addText(`• ${bullet}`, 9);
        });
        yPos += 3;
      });
    }

    // Education
    if (improvedResume.education.length > 0) {
      addText('EDUCATION', 12, true);
      improvedResume.education.forEach(edu => {
        if (typeof edu === 'string') {
          addText(edu, 10);
        } else {
          addText(`${edu.institution} – ${edu.degree}, ${edu.graduation_date}`, 10);
        }
      });
    }

    doc.save(`${improvedResume.name.replace(/\s+/g, '_')}_Resume.pdf`);
  };

  const downloadLaTeX = () => {
    const latex = generateLaTeX();
    const blob = new Blob([latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${improvedResume.name.replace(/\s+/g, '_')}_Resume.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    if (downloadFormat === 'pdf') {
      downloadPDF();
    } else {
      downloadLaTeX();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">✨ Improved Resume (Jake's Format)</h2>
        
        <div className="flex items-center space-x-3">
          {/* Format Selector */}
          <select
            value={downloadFormat}
            onChange={(e) => setDownloadFormat(e.target.value as 'pdf' | 'latex')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pdf">PDF</option>
            <option value="latex">LaTeX</option>
          </select>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>📥</span>
            <span>Download {downloadFormat.toUpperCase()}</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 space-y-6 font-mono text-sm">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-300 pb-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{improvedResume.name}</h3>
          <p className="text-gray-700">{improvedResume.contact}</p>
        </div>

        {/* Summary */}
        {improvedResume.summary && (
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">SUMMARY</h4>
            <p className="text-gray-700">{improvedResume.summary}</p>
          </div>
        )}

        {/* Skills */}
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-2">TECHNICAL SKILLS</h4>
          <p className="text-gray-700">{improvedResume.skills.join(' • ')}</p>
        </div>

        {/* Experience */}
        {improvedResume.experience.length > 0 && (
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">EXPERIENCE</h4>
            <div className="space-y-4">
              {improvedResume.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-2">
                    <div>
                      <span className="font-bold text-gray-900">{exp.company}</span>
                      <span className="text-gray-700"> – {exp.title}</span>
                    </div>
                    <span className="text-gray-600 text-xs">{exp.duration}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    {exp.bullets.map((bullet, bulletIdx) => (
                      <li key={bulletIdx} className="leading-relaxed">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {improvedResume.projects.length > 0 && (
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">PROJECTS</h4>
            <div className="space-y-4">
              {improvedResume.projects.map((project, idx) => (
                <div key={idx}>
                  <div className="mb-2">
                    <span className="font-bold text-gray-900">{project.name}</span>
                    <span className="text-gray-600 text-xs"> | {project.technologies.join(', ')}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    {project.bullets.map((bullet, bulletIdx) => (
                      <li key={bulletIdx} className="leading-relaxed">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {improvedResume.education.length > 0 && (
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">EDUCATION</h4>
            <div className="space-y-1 text-gray-700">
              {improvedResume.education.map((edu, idx) => {
                if (typeof edu === 'string') {
                  return <p key={idx}>{edu}</p>;
                } else {
                  return (
                    <p key={idx}>
                      {edu.institution} – {edu.degree}, {edu.graduation_date}
                    </p>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>

      {/* Jake's Template Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>✅ Jake's Resume Format Applied:</strong> All bullets follow the structure of 
          <strong> Action Verb + Technical Context + Quantifiable Metric</strong>
        </p>
      </div>
    </div>
  );
}