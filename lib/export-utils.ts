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
    // Wait for fonts
    if (typeof (document as any).fonts?.ready !== "undefined") {
      await (document as any).fonts.ready.catch(() => {})
    }

    // Wait a bit for any animations to settle
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Hide problematic elements temporarily
    const svgElements = element.querySelectorAll("svg")
    const originalDisplays: string[] = []
    svgElements.forEach((svg, i) => {
      originalDisplays[i] = (svg as unknown as HTMLElement).style.display
    })

    // Capture with simplified settings
    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      logging: true,
      backgroundColor: "#ffffff",
      onclone: (clonedDoc) => {
        // Force all SVGs to be visible in clone
        const clonedSvgs = clonedDoc.querySelectorAll("svg")
        clonedSvgs.forEach((svg) => {
          ;(svg as unknown as HTMLElement).style.display = "block"
          ;(svg as unknown as HTMLElement).style.opacity = "1"
        })
      },
    })

    // Restore original displays
    svgElements.forEach((svg, i) => {
      ;(svg as unknown as HTMLElement).style.display = originalDisplays[i]
    })

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Canvas capture failed - empty canvas")
    }

    // Create PDF
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 10
    const imgWidth = pageWidth - margin * 2
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Add title
    let yPos = margin
    if (options.title) {
      pdf.setFontSize(16)
      pdf.text(options.title, pageWidth / 2, yPos + 5, { align: "center" })
      pdf.setFontSize(10)
      pdf.text(`Généré le: ${new Date().toLocaleDateString("fr-FR")}`, pageWidth / 2, yPos + 12, {
        align: "center",
      })
      yPos = margin + 20
    }

    // Add image
    const imgData = canvas.toDataURL("image/png", 1.0)
    pdf.addImage(imgData, "PNG", margin, yPos, imgWidth, imgHeight)

    // Add extra pages if needed
    let remainingHeight = imgHeight - (pageHeight - yPos - margin)
    while (remainingHeight > 0) {
      pdf.addPage()
      const offsetY = -(imgHeight - remainingHeight)
      pdf.addImage(imgData, "PNG", margin, offsetY + margin, imgWidth, imgHeight)
      remainingHeight -= pageHeight - margin * 2
    }

    // Metadata
    pdf.setProperties({
      title: options.title || options.filename,
      subject: options.subject || "Energy Management System Report",
      author: options.author || "Smart EMS",
      creator: "Smart EMS v1.0",
    })

    // Download
    pdf.save(options.filename)
  } catch (error) {
    console.error("PDF Export Error Details:", error)
    if (error instanceof Error) {
      throw new Error(`Échec export PDF: ${error.message}`)
    }
    throw new Error("Impossible de générer le rapport PDF. Vérifiez la console (F12).")
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
