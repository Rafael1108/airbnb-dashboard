import {
  renderRoomTypeFrecuencyBarChart,
  renderMonthNeighborhoodLineChart,
} from "./chart.js";
import { renderNeighborhoodTable } from "./table.js";
import { onRenderBoxMonthCard } from "./boxMonthCard.js";
import { renderRoomTypeHeatmaps } from "./map.js";

// Function to load data from CSV file and process it
export function onLoadData() {
  d3.csv("assets/data/australian.csv")
    .then(function (data) {
      onRoomTypeFrecuencyData(data);
      onNeighbourhoodData(data);
      onMonthData(data);
      onMonthNeighborhoodData(data);
      onRoomTypeHeatmaps(data); 
    })
    .catch(function (error) {
      //  Handle error
      console.error("Error al cargar el archivo:", error);
    });
}

// Function to process and render the data for room type frequency
export function onRoomTypeFrecuencyData(data) {
  const groupedData = d3.rollup(
    data,
    (v) => v.length, // frecuency count
    (d) => d.room_type //  group by room type
  );

  renderRoomTypeFrecuencyBarChart(groupedData);
}

// Function to process and render the data for neighborhood statistics
export function onNeighbourhoodData(data) {
  const groupedData = d3.rollup(
    data,
    (v) => ({
      count: v.length,
      minPrice: d3.min(v, (d) => +d.price),
      maxPrice: d3.max(v, (d) => +d.price),
    }),
    (d) => d.neighbourhood, // group by neighbourhood
    (d) => d.room_type //  group by room type
  );

  // Get all unique room types
  const roomTypes = Array.from(new Set(data.map((d) => d.room_type))).sort();

  // Convert to the desired table structure
  const tableData = Array.from(groupedData, ([neighbourhood, roomStats]) => {
    const row = { neighbourhood };
    let totalCount = 0;
    let globalMin = Infinity;
    let globalMax = -Infinity;

    // Add stats for each room type
    roomTypes.forEach((roomType) => {
      const stats = roomStats.get(roomType) || {
        count: 0,
        minPrice: 0,
        maxPrice: 0,
      };

      row[`${roomType}_count`] = stats.count;
      row[`${roomType}_min`] = stats.minPrice;
      row[`${roomType}_max`] = stats.maxPrice;

      totalCount += stats.count;
      if (stats.count > 0) {
        globalMin = Math.min(globalMin, stats.minPrice);
        globalMax = Math.max(globalMax, stats.maxPrice);
      }
    });

    // Add totals
    row.total_count = totalCount;
    row.total_min = globalMin === Infinity ? 0 : globalMin;
    row.total_max = globalMax === -Infinity ? 0 : globalMax;

    return row;
  });

  // Order by max and min total_count
  tableData.sort((a, b) => b.total_count - a.total_count);

  // Filter out neighborhoods with no data:
  const top10Data = tableData
    .slice(0, 10)
    .map((d, i) => ({ ...d, rank: i + 1 }));

  renderNeighborhoodTable({
    roomTypes,
    tableData: top10Data,
  });
}

// Function to process and render the data for month statistics
export function onMonthData(data) {
  const groupedData = d3.rollup(
    data,
    (v) => v.length, // frecuency count
    (d) => d.month, // group by month
    (d) => +d.month_number // group by month number
  );

  const sortedData = Array.from(groupedData, ([month, monthData]) => {
    const [month_number, count] = monthData.entries().next().value;
    return {
      month,
      month_number,
      count,
    };
  }).sort((a, b) => a.month_number - b.month_number);

  onRenderBoxMonthCard(sortedData);
}

// Function to process and render the data for month neighborhood statistics
export function onMonthNeighborhoodData(data) {
  const groupedData = d3.rollup(
    data,
    (v) => v.length, // frecuency count
    (d) => d.room_type, //  group by room type
    (d) => d.month, // group by month
    (d) => +d.month_number // group by month number
  );

  const sortedData = Array.from(groupedData, ([month, monthData]) => {
    const [month_number, count] = monthData.entries().next().value;
    return {
      month,
      month_number,
      count,
    };
  }).sort((a, b) => a.month_number - b.month_number);
  renderMonthNeighborhoodLineChart(data, groupedData);
}

// Function to render the box month card
export function onRoomTypeHeatmaps(data) {
  renderRoomTypeHeatmaps(data);
}