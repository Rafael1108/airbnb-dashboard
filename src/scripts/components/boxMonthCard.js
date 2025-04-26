import { getContainer, drawColSection } from "./generic.js";

export function onRenderBoxMonthCard(data) {
  // Create table structure
  const boxSection = getContainer("#row-1");

  // Clean up the previous table
  boxSection.html("");

  // colors for the boxes
  const colors = [
    "--bs-primary",
    "--bs-danger",
    "--bs-success",
    "--bs-warning",
  ];

  data.forEach((d, i) => {
    const boxS = drawColSection(
      boxSection,
      `box-row-${d.month_number}`,
      "",
      `border-radius: 0.4rem; border-left: 1.2rem var(--bs-border-style) var(${colors[i]}) !important;`
    )
      .append("div")
      .attr("class", "row no-gutters align-items-center");

    const box = boxS.append("div").attr("class", "col mr-2");

    box.append("h3").text(`${d.month}`);
    box
      .append("div")
      .attr("class", "text-xs font-weight-bold text-primary")
      .text(`${d.count}`);
  });
}
