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

    // Clone report into an offscreen container to avoid layout issues
    const wrapper = document.createElement("div")
    wrapper.style.position = "fixed"
    wrapper.style.left = "-9999px"
    wrapper.style.top = "0"
    wrapper.style.width = "1024px"
    wrapper.style.background = "#eaf4ff"
    wrapper.style.padding = "16px"
    wrapper.style.zIndex = "-1"

    const clone = element.cloneNode(true) as HTMLElement
    clone.style.background = "#eaf4ff"
    clone.style.color = "#0f172a"
    wrapper.appendChild(clone)
    document.body.appendChild(wrapper)

    const svgElements = clone.querySelectorAll("svg")
    svgElements.forEach((svg) => {
      ;(svg as unknown as HTMLElement).style.display = "block"
      ;(svg as unknown as HTMLElement).style.opacity = "1"
    })

    let canvas: HTMLCanvasElement | null = null
    try {
      // Capture with safer settings
      canvas = await html2canvas(clone, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#eaf4ff",
        onclone: (clonedDoc) => {
          const body = clonedDoc.body
          body.style.background = "#eaf4ff"
          const clonedSvgs = clonedDoc.querySelectorAll("svg")
          clonedSvgs.forEach((svg) => {
            ;(svg as unknown as HTMLElement).style.display = "block"
            ;(svg as unknown as HTMLElement).style.opacity = "1"
          })
        },
      })
    } catch (captureError) {
      console.error("PDF capture failed, falling back to text report:", captureError)
      canvas = null
    } finally {
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper)
      }
    }

    // Create PDF
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 10
    const imgWidth = pageWidth - margin * 2

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

    if (canvas && canvas.width > 0 && canvas.height > 0) {
      const imgHeight = (canvas.height * imgWidth) / canvas.width
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
    } else {
      pdf.setFontSize(12)
      pdf.text("Aperçu non disponible - rapport texte", margin, yPos + 10)
      pdf.setFontSize(10)
      pdf.text(`Date: ${new Date().toLocaleDateString("fr-FR")}`, margin, yPos + 18)
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
