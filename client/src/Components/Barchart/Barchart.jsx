import { React, useState, useEffect } from "react";
import axios from "axios";
import  "./Barchart.css"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import {
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
} from "@mui/material";

const Barchart = () => {
  const [data, setdata] = useState([]);
  const [month, setmonth] = useState("01");

  const handleChange = (event) => {
    setmonth(event.target.value);
  };

  const FetchData = async () => {
    const data = await axios.get(`http://localhost:5000/for_bar_chart/${month}`);
    console.log(data.data.countPriceRange[0],'from chart')

    const chartData = Object.keys(data.data.countPriceRange[0]).filter(key => key !== '_id').map(key => ({
      name: key,
      value: data.data.countPriceRange[0][key]
    }));
    setdata(chartData);
  };

  console.log(data, "Ass")

  // console.log(Object.values(data?.countPriceRange[0]), "cahrt");

  useEffect(() => {
    FetchData();
  }, [month]);
  return (
    <div className="barchart-container">
      <h1>Barchart</h1>
      <FormControl>
        <InputLabel id="demo-simple-select-label" sx={{ minWidth: "200px" }}>
          Select Month
        </InputLabel>
        <Select
          value={month}
          label="month"
          onChange={(e) => handleChange(e)}
          sx={{ minWidth: "150px" }}
        >
          {/* <MenuItem value={""} >Select</MenuItem> */}
          <MenuItem value={"01"} selected>
            Jan
          </MenuItem>
          <MenuItem value={"02"}>Feb</MenuItem>
          <MenuItem value={"03"}>march</MenuItem>
          <MenuItem value={"04"}>April</MenuItem>
          <MenuItem value={"05"}>May</MenuItem>
          <MenuItem value={"06"}>June</MenuItem>
          <MenuItem value={"07"}>July</MenuItem>
          <MenuItem value={"08"}>Aug</MenuItem>
          <MenuItem value={"09"}>Sept</MenuItem>
          <MenuItem value={"010"}>Oct</MenuItem>
          <MenuItem value={"11"}>Nov</MenuItem>
          <MenuItem value={"12"}>Dec</MenuItem>
        </Select>
      </FormControl>

      <Box className="chart-container">
    <BarChart width={730} height={350} data={data} {...{
     overflow: 'visible'
   }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name"  
              // ticks={xValues.sort()} // gets all of the values
              interval={0} // display all of values, instead of the default 5
              angle={-65}
              labe  // force text to be 90, reading towards the graph
              textAnchor="end"/>
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  </Box>
    </div>
  );
};

export default Barchart;
