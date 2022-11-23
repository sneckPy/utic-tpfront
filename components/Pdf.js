
import jsPDF from 'jspdf'

export default function ({ data, headers, filename }) {
    const doc = new jsPDF()


    // NEW CODE
    // ROWS
    data.forEach((row, rIndex) => {
        // Here we are going to collect all columns potential max heights (below)
        // Before we determine the nextYPosition we have to grab the tallest value
        // and add that to the previous height.
        const rowHeights = []

        /*
        *
        * Row styles go here (lines, images, shapes)
        *
        * */

        // COLUMNS
        headers.forEach((column, colIndex) => {

            // Using the .splitTextToSize method will take a 
            // string and a width parameter. It will return an array of strings. 
            const longText = doc.splitTextToSize(String(row[column.key]), xPositions[colIndex] - xPositions[colIndex !== 0 && colIndex - 1])

            // To get row height, we will use the .getLineHeight method
            // This method returns a line height based on set text 
            // size for the document. Multiplied by the array length, your
            // value should be at minimum a standard line of text, OR at
            // maximum the amount of lines of text by line height
            const rowHeight = longText.length * doc.getLineHeight()

            // We need to push this height value to the array of heights for 
            // the row (above)
            rowHeights.push(rowHeight)

            /*
            *
            *  Column styles go here (lines, images, shapes)
            *
            * */

            doc.text(longText, xPositions[colIndex], nextYPos)
        })

        // Here's the accumulator expression to inform the next row start point
        nextYPos = nextYPos + padding + Math.max(...rowHeights, 30)

        // When generating looped data, you may need to add pages manually.
        // The good thing is that we've defined our live area boundaries,
        // and can add a new page when our yPosition exceeds them. We need
        // to take some care to reset the yPosition because if you don't:
        // the yPosition will persist to the next page, and more than likely
        // disappear from view as your yPosition grows.
        if (nextYPos > liveArea.height) {
            doc.addPage()
            nextYPos = baseYPosForRows
        }
    })

    doc.save(filename)
}