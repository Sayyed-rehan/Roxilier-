import { React, useEffect, useState } from "react";
import "./Statistics.css"
import {
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Pagination,Box
} from "@mui/material";
import axios from "axios";

const Statistics = () => {
  const [month, setmonth] = useState("01");
  const [data, setdata] = useState([])

  const fetchStatisticsData = async () => {
    const data = await axios.get(
      `http://localhost:5000/for_statistics/${month}`
    );
    // console.log(data.data, 'stats');
    setdata(data.data)
  };

  console.log(data, "asss")

  const handleChange = (event) => {
    setmonth(event.target.value);
  };

  useEffect(() => {
    fetchStatisticsData();
  },[month]);

  return (
    <div className="stat-container">
      <h1>Statistics</h1>
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
          <MenuItem value={"01"} selected>Jan</MenuItem>
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

      <Box sx={{mt:"20px", p:"30px", bgcolor:'#ffe0b2', borderRadius:"15px"}}>
      <Typography variant="h5">Total Sale - {data.totalSale}</Typography>
      <Typography variant="h5">Total Sale Item - {data?.countNotsale}</Typography>
      <Typography variant="h5">Total not Sale Item - {data?.countSale}</Typography>
      </Box>
    </div>
  );
};

export default Statistics;
