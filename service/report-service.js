const dayjs = require("dayjs");
const { jsPDF } = require("jspdf");
const montserratNormal = require("./fonts/Montserrat-normal.js");
const montserratBold = require("./fonts/Montserrat-bold.js");

function setFonts(doc) {
  doc.addFileToVFS("Montserrat-Regular.ttf", montserratNormal);
  doc.addFont("Montserrat-Regular.ttf", "Montserrat", "normal");

  doc.addFileToVFS("Montserrat-Bold.ttf", montserratBold);
  doc.addFont("Montserrat-Bold.ttf", "Montserrat", "bold");
}

function addText(doc, text, x, y, marginTop, marginBottom,) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const lineHeight = doc.getLineHeight() / doc.internal.scaleFactor;

  if (y + lineHeight > pageHeight - marginBottom) {
    doc.addPage();      
    y = marginTop;     
  }

  doc.text(text, x, y);
  y += lineHeight; 
  return y;
}

function addParagraphJustified(doc, text, x, y, opts = {}) {
  const {
    maxWidth = 190,
    marginTop = 20,
    marginBottom = 20,
    lineSpacing = 1.15,
    lastLineAlign = "left",
  } = opts;

  const pageHeight = doc.internal.pageSize.getHeight();
  const pageBottom = pageHeight - marginBottom;

  const lines = doc.splitTextToSize(text, maxWidth);

  const baseLineHeight = doc.getLineHeight() / doc.internal.scaleFactor;
  const lineHeight = baseLineHeight * lineSpacing;

  for (let i = 0; i < lines.length; i++) {
    if (y + lineHeight > pageBottom) {
      doc.addPage();
      y = marginTop;
    }

    const line = String(lines[i]).trim();

    if (i === lines.length - 1) {
      if (lastLineAlign === "center") {
        doc.text(line, x + maxWidth / 2, y, { align: "center" });
      } else if (lastLineAlign === "right") {
        doc.text(line, x + maxWidth, y, { align: "right" });
      } else {
        doc.text(line, x, y);
      }
      y += lineHeight;
      continue;
    }

    const words = line.split(/\s+/).filter(Boolean);

    if (words.length === 1) {
      doc.text(words[0], x, y);
      y += lineHeight;
      continue;
    }

    const wordsWidths = words.map((w) => doc.getTextWidth(w));
    const wordsTotalWidth = wordsWidths.reduce((a, b) => a + b, 0);

    const spaceCount = words.length - 1;
    let spaceWidth = (maxWidth - wordsTotalWidth) / spaceCount;
    if (!isFinite(spaceWidth) || spaceWidth < 0) spaceWidth = 0;

    let currentX = x;
    for (let k = 0; k < words.length; k++) {
      const w = words[k];
      doc.text(w, currentX, y);
      const advance = (wordsWidths[k] || doc.getTextWidth(w)) + spaceWidth;
      currentX += advance;
    }

    y += lineHeight;
  }

  return y;
}

function createReport(patient, data) {
  const doc = new jsPDF({ unit: "mm"});
  setFonts(doc);
  const maxWidth = 190, marginLeft = 10, marginTop = 20, marginBottom = 20; 
  
  doc.setFont("Montserrat", "bold");
  doc.setFontSize(18);               
  doc.text(["Relatório Geral do Paciente"], marginLeft, 20);

  doc.setFont("Montserrat", "normal");
  doc.setFontSize(12);
  doc.text([
    patient.name, 
    "CPF: "+patient.cpf, 
    "Telefone: "+patient.phone
  ], marginLeft + maxWidth + 1, 18, { align: "right" });

  let y = 45;
  data.forEach(element => {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    const lineHeight = doc.getLineHeight() / doc.internal.scaleFactor;
    const pageWidth = doc.internal.pageSize.getHeight() - marginBottom
    if (y + lineHeight * 2 >= pageWidth) {
      doc.addPage();      
      y = marginTop;  
    }
    y = addText(doc, "Evolução", marginLeft, y, marginTop, marginBottom);
    
    const date = dayjs(element.createdAt).format("DD/MM/YYYY HH:mm");
    doc.setFont("Helvetica", "bold");
    y = addText(doc, "Profissional: " + element.professional.name, marginLeft, y, marginTop, marginBottom);
    const dateHeight = y === marginTop ? y : y - lineHeight;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(date, marginLeft + maxWidth, dateHeight, { align: "right" });

    doc.setFontSize(11);
    y = addParagraphJustified(doc, element.subject, marginLeft, y) + 5;
  });

  doc.save("a4.pdf");
  return true;
}

module.exports = { 
  createReport 
};