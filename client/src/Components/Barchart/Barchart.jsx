import {React, useState, useEffect} from 'react'
import axios from "axios";
import {Bar, BarChart, CartesianGrid, Label, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer, Rectangle }from 'recharts'
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

const Barchart = () => {

    const [data, setdata] = useState([])
    const [month, setmonth] = useState("01");

    const handleChange = (event) => {
        setmonth(event.target.value);
      };

    const FetchData = async()=>{
        const data = await axios.get(`http://localhost:5000/for_bar_chart/12`)
        console.log(data.data, "nasnka")
        setdata(data.data)
    }

    console.log(data.countPriceRange, 'cahrt')

    useEffect(()=>{
        FetchData()
    },[month])
  return (
    <div>
        <h1>Barcahrt</h1>
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


      <Box className="chart-container">
 

        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={[10,20,30,40]}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </ResponsiveContainer>
        </Box>
    </div>
  )
}

export default Barchart