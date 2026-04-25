import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Set PDF.js worker to match the exact installed version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`;

export function useFileProcessor() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      setProgress(Math.round((i / pdf.numPages) * 70));
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  };

  const extractTextFromImage = async (file) => {
    const { data: { text } } = await Tesseract.recognize(file, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          setProgress(Math.round(m.progress * 70));
        }
      },
    });
    return text.trim();
  };

  const processFile = useCallback(async (file) => {
    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      // Validate 1MB limit
      if (file.size > 1024 * 1024) {
        throw new Error('File size exceeds 1MB. Please compress your file and try again.');
      }

      let extractedText = '';
      const fileType = file.type;

      setProgress(10);

      if (fileType === 'application/pdf') {
        extractedText = await extractTextFromPDF(file);
      } else if (fileType.startsWith('image/')) {
        extractedText = await extractTextFromImage(file);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF, JPG, or PNG.');
      }

      setProgress(80);

      if (!extractedText || extractedText.length < 50) {
        throw new Error('Could not extract readable text. Please upload a clearer document.');
      }

      setProgress(100);
      return {
        text: extractedText,
        fileName: file.name,
        fileType: fileType === 'application/pdf' ? 'pdf' : 'image',
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setProcessing(false);
    }
  }, []);

  return { processFile, processing, progress, error };
}
