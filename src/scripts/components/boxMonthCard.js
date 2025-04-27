import { getContainer } from "./generic.js";

export function onRenderBoxMonthCard(data) {
  // Create table structure
  const section = getContainer("#row-2 #col-1");

  // Clean up the previous table
  section.html("");

  const boxSection = section
    .append("div")
    .attr("class", "row")
    .style("padding", "0 1rem 0 1rem");
 
  // colors for the boxes
  const colors = [
    "--bs-primary",
    "--bs-danger",
    "--bs-success",
    "--bs-warning",
  ];

  data.forEach((d, i) => {
    const boxS = boxSection
      .append("div")
      .attr("class", "col-12 col-md-6 mb-4")
      .style("margin", "0.8rem") 
      .style("width", "45%")
      .append("div")
      .attr("class", "card")
      .attr("id", `box-row-${d.month_number}`)
      .attr(
        "style",
        `border-radius: 0.4rem; border-left: 1.2rem var(--bs-border-style) var(${colors[i]}) !important;`
      )
      .append("div")
      .attr("class", "card-body");  
      boxS.append("div").attr("class", "row no-gutters align-items-center");

    const box = boxS.append("div").attr("class", "col mr-2");

    box.append("h3").text(`${d.month}`);
    box
      .append("div")
      .attr("class", "text-xs font-weight-bold text-secondary")
      .text(`Reservas`);
     box
       .append("div")
       .attr("class", "text-sm text-primary")
       .style("font-color", `var(${colors[i]})`)
       .text(`${d.count}`);
  });
}
