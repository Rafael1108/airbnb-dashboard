// Function to render the table
export function renderNeighborhoodTable(processedData) {
  const { roomTypes, tableData } = processedData;
const tbl = d3.select("#table-container");
  // Clean up the previous table
  tbl.html("");

  // Create table structure
  const table = tbl.append("table").attr("class", "neighborhood-table");

  // Create header row
  const thead = table.append("thead");
  const headerRow = thead.append("tr");

  // Add neighborhood header
  headerRow.append("th").text("#").attr("rowspan", 2);
  headerRow.append("th").text("Barrios").attr("rowspan", 2);

  // Add room type headers
  roomTypes.forEach((roomType) => {
    headerRow.append("th").attr("colspan", 2).text(roomType);
  });

  // Add total header 
  const subHeaderRow = thead.append("tr");
  roomTypes.forEach(() => { 
    subHeaderRow.append("th").text("Min");
    subHeaderRow.append("th").text("Max");
  }); 

  // Create table body
  const tbody = table.append("tbody");

  // Add data rows
  const rows = tbody.selectAll("tr").data(tableData).enter().append("tr");

  // Add neighborhood name
    rows.append("td").text((d) => d.rank);
  rows.append("td").text((d) => d.neighbourhood);

  // Add room type data
  roomTypes.forEach((roomType) => { 
    rows
      .append("td")
      .text((d) =>
        d[`${roomType}_count`] ? "A$ " + d[`${roomType}_min`] : "-"
      );
    rows
      .append("td")
      .text((d) =>
        d[`${roomType}_count`] ? "A$ " + d[`${roomType}_max`] : "-"
      );
  });

  // Apply some basic styling
  d3.select(".neighborhood-table")
    .style("border-collapse", "collapse")
    .style("width", "100%");

  d3.selectAll(".neighborhood-table th, .neighborhood-table td")
    .style("border", "1px solid #ddd")
    .style("padding", "8px")
    .style("text-align", "center");

  d3.selectAll(".neighborhood-table th").style("background-color", "#f2f2f2");
}
