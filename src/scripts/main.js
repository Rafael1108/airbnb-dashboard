// Main JavaScript file for the Airbnb Dashboard
import { getContainer } from "./components/generic.js";
import { renderLineChart } from "./components/lineChart.js";
import { renderBarChart } from "./components/barChart.js";
import { renderMap } from "./components/mapChart.js";

// Constants for layout
const ROW_COUNT = 4;

// Initialize the layout
initializeLayout();

// Function to initialize the layout
function initializeLayout() {
  createHeader();
  createMainContainer();
  createSections();
  createFooter();
}

// Function to refresh data and render the dashboard
// This function is called when the page is loaded or when the refresh button is clicked
function onRefreshData() {
  // Load data and initialize dashboard
  d3.json("assets/data/airbnb_data.json").then((data) => {
    renderMap(data);
    renderBarChart(data);
    renderLineChart(data);
    populateTable(data);
  });
}

// Function to create the header
function createHeader() {
  d3.select("#main-body")
    .append("header")
    .append("h1")
    .text("Airbnb Dashboard");
}

// Function to create the main container
function createMainContainer() {
  // Create a main container for the dashboard
  d3.select("#main-body")
    .append("main")
    .attr("class", "container-fluid --bs-light")
    .append("div")
    .attr("class", "text-center")
    .attr("id", "main-container");

  // Create a grid layout for the main container
  createRows(ROW_COUNT);
}

// Function to create rows dynamically in the main container
function createRows(rowCount) {
  const mainContainer = getContainer("#main-container");

  // Create a grid layout for the main container
  for (let i = 0; i < rowCount; i++) {
    mainContainer
      .append("div") // add a new <div> for each row
      .attr("class", "row") // assign a class "row" to each <div>
      .attr("id", `row-${i}`); // assign a unique id to each row
  }
}

// Function to create the footer
function createFooter() {
  d3.select("#main-body").append("footer").append("p").text("Data from Airbnb");
}

// Function to create sections in the main container
function createSections() {
  createMapSection("#row-1");
  createChartsSection("#row-1");
  createTableSection("#row-2");
  onRefreshData();
}
 

// Function to create the map section
function createMapSection(containerId) {
  const mapSection = getContainer(containerId)
    .append("div")
    .attr("class", "col")
    .append("div")
    .attr("class", "card")
    .attr("id", "map-div")
    .append("div")
    .attr("class", "card-body");

  mapSection
    .append("h5")
    .attr("class", "card-title")
    .text("Airbnb Listings Map");
  mapSection.append("div").attr("class", "card-graph").attr("id", "map");
}

// Function to create the charts section
function createChartsSection(containerId) {
  const chartsSection = getContainer(containerId)
    .append("div")
    .attr("class", "col")
    .style("display","grid") 
    .style("gap", "20px");

  // Create a bar chart section
  const barChart = chartsSection
    .append("div")
    .attr("class", "row")
    .append("div")
    .attr("class", "card")
    .attr("id", "bar-chart")
    .append("div")
    .attr("class", "card-body");

  barChart
    .append("h5")
    .attr("class", "card-title")
    .text("Top 5 Cities by Listings");

  barChart
    .append("div")
    .attr("class", "card-graph")
    .append("svg")
    .style("height", "100px");

  // Create a line chart section
  const lineChart = chartsSection
    .append("div")
    .attr("class", "row")
    .append("div")
    .attr("class", "card")
    .attr("id", "line-chart")
    .append("div")
    .attr("class", "card-body");
  lineChart
    .append("h5")
    .attr("class", "card-title")
    .text("Price Trends Over Time");

  lineChart
    .append("div")
    .attr("class", "card-graph")
    .append("svg")
    .style("height", "100px");

  // Create a line chart section
  const lineChart2 = chartsSection
    .append("div")
    .attr("class", "row")
    .append("div")
    .attr("class", "card")
    .attr("id", "line-chart")
    .append("div")
    .attr("class", "card-body");
  lineChart2
    .append("h5")
    .attr("class", "card-title")
    .text("Price Trends Over Time 2");

  lineChart2
    .append("div")
    .attr("class", "card-graph")
    .append("svg")
    .style("height", "100px");
}

// Function to create the table section
function createTableSection(containerId) {
  const tableSection = getContainer(containerId)
    .append("div")
    .attr("class", "col")
    .append("div")
    .attr("class", "card")
    .attr("id", "table-section")
    .append("div")
    .attr("class", "card-body");

  tableSection
    .append("h5")
    .append("div")
    .attr("class", "card-graph")
    .attr("class", "card-title")
    .text("Listings Data");

  const table = tableSection
    .append("div")
    .attr("class", "card-graph")
    .append("div")
    .attr("class", "table-responsive")
    .append("table")
    .attr("class", "table  table-striped table-hover");

  const thead = table.append("thead").attr("class", "table-dark");
  thead
    .append("tr")
    .selectAll("th")
    .data(["Date", "City", "Price", "Rating"])
    .enter()
    .append("th")
    .attr("scope", "col")
    .text((d) => d);

  table.append("tbody").attr("id", "table-body");
}

// Populate table
function populateTable(data) {
  const tbody = d3.select("#table-body");
  data.forEach((d) => {
    const row = tbody.append("tr");
    row.append("td").text(d.date);
    row.append("td").text(d.city);
    row.append("td").text(d.price);
    row.append("td").text(d.rating);
  });
}
