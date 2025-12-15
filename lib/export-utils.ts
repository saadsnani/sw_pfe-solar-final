import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface ExportOptions {
  filename: string
  title?: string
  subject?: string
  author?: string
}

export async function exportToPDF(
  element: HTMLElement,
  options: ExportOptions
): Promise<void> {
  try {
    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    // Calculate dimensions
    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? "portrait" : "landscape",
      unit: "mm",
      format: "a4",
    })

    const pageHeight = pdf.internal.pageSize.getHeight()
    const pageWidth = pdf.internal.pageSize.getWidth()
    let heightLeft = imgHeight

    // Add title if provided
    if (options.title) {
      pdf.setFontSize(16)
      pdf.text(options.title, pageWidth / 2, 15, { align: "center" })
      pdf.setFontSize(10)
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 22, {
        align: "center",
      })
    }

    // Add image to PDF
    const imgData = canvas.toDataURL("image/png")
    const topPosition = options.title ? 30 : 10
    pdf.addImage(imgData, "PNG", 0, topPosition, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft >= 0) {
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, -heightLeft, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Set PDF metadata
    pdf.setProperties({
      title: options.title || options.filename,
      subject: options.subject || "Energy Management System Report",
      author: options.author || "Smart EMS",
    })

    // Save PDF
    pdf.save(options.filename)
  } catch (error) {
    console.error("Error exporting PDF:", error)
    throw new Error("Failed to export PDF")
  }
}

export function generateReportData(data: Record<string, unknown>): string {
  return JSON.stringify(data, null, 2)
}

export async function downloadJSON(
  data: Record<string, unknown>,
  filename: string
): Promise<void> {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
