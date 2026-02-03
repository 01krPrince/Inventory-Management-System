import html2pdf from 'html2pdf.js';

export type PageFormat = 'A4' | 'A5' | 'Letter' | 'Legal' | 'POS_80mm' | 'POS_58mm';

interface DownloadPdfOptions {
  elementId: string;
  fileName: string;
  format?: PageFormat;
  scale?: number;
  orientation?: 'portrait' | 'landscape';
}

export const downloadPdf = async ({
  elementId,
  fileName,
  format = 'A4',
  scale = 2,
  orientation = 'portrait'
}: DownloadPdfOptions): Promise<boolean> => {
  
  // 1. Check if Element Exists
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`❌ PDF Utils: Element with ID '${elementId}' not found in DOM.`);
    alert("Error: The invoice preview is not visible. Please open the preview first.");
    return false;
  }

  // 2. Configure Format
  let jsPdfFormat: string | [number, number] = 'a4';
  let margin = 0.2; 

  switch (format) {
    case 'POS_80mm': jsPdfFormat = [80, 2000]; margin = 0; break;
    case 'POS_58mm': jsPdfFormat = [58, 2000]; margin = 0; break;
    case 'A5': jsPdfFormat = 'a5'; break;
    case 'Letter': jsPdfFormat = 'letter'; break;
    case 'Legal': jsPdfFormat = 'legal'; break;
    default: jsPdfFormat = 'a4'; break;
  }

  // 3. Configure Options
  const opt = {
    margin: margin,
    filename: fileName,
    image: { type: 'jpeg' as const, quality: 0.98 },
    enableLinks: true,
    html2canvas: { 
      scale: scale, 
      useCORS: true, // IMPORTANT: Allows loading external images (like logos)
      scrollY: 0,
      logging: true, // Enable logging to see canvas errors in console
    },
    jsPDF: { 
      unit: format.startsWith('POS') ? 'mm' : 'in', 
      format: jsPdfFormat, 
      orientation: orientation 
    }
  };

  try {
    // 4. Robust Library Check
    // Some bundlers import html2pdf as a module, others as default. 
    // We try to grab the function safely.
    const worker = typeof html2pdf === 'function' 
      ? html2pdf() 
      : (window as any).html2pdf 
        ? (window as any).html2pdf() 
        : null;

    if (!worker) {
      console.error("❌ html2pdf library not found. Ensure 'npm install html2pdf.js' is run.");
      throw new Error("PDF Library missing");
    }

    console.log("🖨️ Generating PDF...");
    await worker.set(opt).from(element).save();
    console.log("✅ PDF Generated Successfully");
    return true;

  } catch (error) {
    console.error("❌ PDF Generation Critical Error:", error);
    // Fallback to browser print if PDF generation fails completely
    const userWantsPrint = window.confirm("PDF Generation failed. Do you want to use the browser printer instead?");
    if (userWantsPrint) {
      window.print();
    }
    return false;
  }
};

export const getPdfFileName = (docType: string, docNumber: string): string => {
  const dateStr = new Date().toISOString().split('T')[0];
  const safeDocNum = (docNumber || 'Draft').replace(/[\/\\?%*:|"<>]/g, '-');
  return `${docType}_${safeDocNum}_${dateStr}.pdf`;
};