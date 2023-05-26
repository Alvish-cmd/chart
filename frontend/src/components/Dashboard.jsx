import React, { useEffect, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Dropdown } from "primereact/dropdown";
import "../style.css";

// theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

// core
import "primereact/resources/primereact.min.css";

function Dashboard() {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState("bar");
  const [year, setYear] = useState(2021);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8000/Users");
      const responseData = await response.json();
      setData(responseData.data);
    };

    fetchData();
  }, []);

  // Showing a date in table format
  const formatDate = (date) => {
    if (date) {
      const options = { year: "numeric", month: "numeric", day: "numeric" };
      return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
    }
    return "";
  };
  const filteredData = data?.filter(
    (user) => user.created_at.slice(0, 4) === year.toString()
  );

  const getbyMonth = (m) => {
    return filteredData?.filter((d) => d.created_at.split("-")[1] === m);
  };

  // For main Search
  const header = (
    <div className="table-header">
      <h5>Search</h5>
      <InputText
        type="search"
        onInput={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search"
      />
    </div>
  );

  // In pie chart count a active and inactive and disabled
  const ChartData = () => {
    const Count = {
      active: 0,
      inactive: 0,
      disabled: 0,
    };
    data.forEach((user) => {
      switch (user.status) {
        case "active":
          Count.active++;
          break;
        case "inactive":
          Count.inactive++;
          break;
        case "disabled":
          Count.disabled++;
          break;
        default:
          break;
      }
    });

    //  for count in the database
    const allData = Object.entries(Count).map(([status, count]) => ({
      name: status,
      y: count,
    }));

    return allData;
  };

  // In a dropdown chart type value passed
  const chartTypeOptions = [
    { label: "Line Chart", value: "line" },
    { label: "Bar Chart", value: "bar" },
  ];

  const handleChartTypeChange = (event) => {
    setSelectedChartType(event.value);
  };

  // Date filter in chart
  const dateFilterFunction = (value, filter) => {
    if (
      filter === undefined ||
      filter === null ||
      (typeof filter === "string" && filter.trim() === "")
    ) {
      return true;
    }

    if (value === undefined || value === null) {
      return false;
    }

    const formattedValue = formatDate(value);
    return formattedValue.includes(filter);
  };

  //  For pie chart
  const chartOptionsPie = {
    chart: {
      type: "pie",
    },
    title: {
      text: "User Status like active/inactive/disabled",
    },
    series: [
      {
        name: "Users",
        data: ChartData(),
      },
    ],
  };

  // for line chart
  const chartOptionsLine = {
    chart: {
      type: selectedChartType ? "line" : "line",
    },
    title: {
      text: `Signup - Users - ${year}`,
    },
    xAxis: {
      categories: [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ],
    },
    yAxis: {
      title: {
        text: "No. of Users",
      },
    },
    series: [
      {
        name: `${year}`,
        data: [
          getbyMonth("01")?.length,
          getbyMonth("02")?.length,
          getbyMonth("03")?.length,
          getbyMonth("04")?.length,
          getbyMonth("05")?.length,
          getbyMonth("06")?.length,
          getbyMonth("07")?.length,
          getbyMonth("08")?.length,
          getbyMonth("09")?.length,
          getbyMonth("10")?.length,
          getbyMonth("11")?.length,
          getbyMonth("12")?.length,
        ],
      },
    ],
  };

  // for bar chart
  const chartOptionsBar = {
    chart: {
      type: selectedChartType ? "column" : "bar",
    },
    title: {
      text: `Signed up - Users - ${year}`,
    },
    xAxis: {
      categories: [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ],
    },
    yAxis: {
      title: {
        text: "No. of Users",
      },
    },
    series: [
      {
        name: `${year}`,
        data: [
          getbyMonth("01")?.length,
          getbyMonth("02")?.length,
          getbyMonth("03")?.length,
          getbyMonth("04")?.length,
          getbyMonth("05")?.length,
          getbyMonth("06")?.length,
          getbyMonth("07")?.length,
          getbyMonth("08")?.length,
          getbyMonth("09")?.length,
          getbyMonth("10")?.length,
          getbyMonth("11")?.length,
          getbyMonth("12")?.length,
        ],
      },
    ],
  };

  return (
    <>
      {/* Datatable for global search and therir column */}
      <h1 className="DataTable">Data Table</h1>
      <div className="table">
        <DataTable
          value={data}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          globalFilter={globalFilter}
          header={header}
        >
          <Column
            field="name"
            header="Name"
            sortable
            filter
            style={{ width: "25%" }}
          ></Column>

          <Column
            field="username"
            header="Username"
            filter
            sortable
            style={{ width: "25%" }}
          ></Column>

          <Column
            field="email"
            header="Email"
            sortable
            filter
            style={{ width: "25%" }}
          ></Column>

          <Column
            field="dob"
            header="Date of Birth"
            sortable
            filter
            filterMatchMode={FilterMatchMode.CUSTOM}
            filterFunction={dateFilterFunction}
            style={{ width: "25%" }}
            body={(rowData) => formatDate(rowData.dob)}
          ></Column>

          <Column
            field="no_of_companies"
            header="No of Companies"
            filter
            sortable
            style={{ width: "25%" }}
          ></Column>

          <Column
            field="status"
            header="Status"
            sortable
            filter
            style={{ width: "25%" }}
          ></Column>
        </DataTable>
      </div>

      {/* For chart dropdown */}
      <br /><br />
        <h5 className="chart-types">Select Chart Type:</h5>
      <div className="chart-dropdown">
        <Dropdown
          className="chartFilter"
          value={selectedChartType}
          options={chartTypeOptions}
          onChange={handleChartTypeChange}
          placeholder="Select a chart type"
        />

        {/* for chart year filter dropdown */}
        <Dropdown
          className="yearFilter"
          value={year}
          options={[2021, 2022, 2023, 2029]}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>

      {/* for bar chart */}
      <h5 className="chart-types-dynamic">{selectedChartType} Chart</h5>
      <div className="chart">
        {selectedChartType === "bar" && (
          <HighchartsReact highcharts={Highcharts} options={chartOptionsBar} />
        )}

        {/* for line chart */}
        {selectedChartType === "line" && (
          <HighchartsReact highcharts={Highcharts} options={chartOptionsLine} />
        )}
      </div>
          <br /><br />
      {/* for pie chart */}
      <h5 className="Pie-chart">Pie chart:</h5>
      <br /><br />
      <div className="chart-container">
        <HighchartsReact highcharts={Highcharts} options={chartOptionsPie} />
      </div>
    </>
  );
}

export default Dashboard;
