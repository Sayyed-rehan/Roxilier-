import { React, useEffect, useState } from "react";
import axios from "axios";
import Statistics from "./Components/Statistics/Statistics";
import Barchart from "./Components/Barchart/Barchart";
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
  Pagination,
} from "@mui/material";

const App = () => {
  const [AllTransactionsquery, setAllTransactionsquery] = useState({
    search: "",
    page: "1",
    perPage: 10,
  });

  const [TransactionData, setTransactionData] = useState([]);

  console.log(AllTransactionsquery);
  // console.log(TransactionData.total, "Ass");

  const FetchAllTransactions = async () => {
    let data = await axios.get(
      `http://localhost:5000/ass/?search=${AllTransactionsquery.search}&page=${AllTransactionsquery.page}&perPage=${AllTransactionsquery.perPage}&month=${month}`
    );
    // console.log(data.data, 'hello');
    setTransactionData(data.data);
  };

  const handleChnage = (e) => {
    setAllTransactionsquery({
      ...AllTransactionsquery,
      search: e.target.value,
      page: 1
    });
  };

  const [month, setmonth] = useState("");

  const handleChange = (event) => {
    setmonth(event.target.value);
    setAllTransactionsquery({
      ...AllTransactionsquery,
      page: 1
    });
  };

  useEffect(() => {
    FetchAllTransactions();
    
  }, [AllTransactionsquery, month]);

  return (
    <div className="container">
      <Typography variant="h3">Dashboard</Typography>
      <TextField
        required
        id="outlined-required"
        label="Required"
        value={AllTransactionsquery.search}
        name="search"
        onChange={(e) => handleChnage(e)}
      />

      <FormControl>
        <InputLabel id="demo-simple-select-label" sx={{ minWidth: '200px' }}>Select Month</InputLabel>
        <Select value={month} label="month" onChange={(e) => handleChange(e)} sx={{ minWidth: '150px' }}>
          <MenuItem value={""}>Select</MenuItem>
          <MenuItem value={"01"}>Jan</MenuItem>
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

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Desc</TableCell>
              <TableCell align="center">price</TableCell>
              <TableCell align="center">category</TableCell>
              <TableCell align="center">sold</TableCell>
              <TableCell align="center">img</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {TransactionData?.data?.map((x) => (
              <TableRow>
                <TableCell align="center">{x.id}</TableCell>
                <TableCell align="center">{x.title}</TableCell>
                <TableCell align="center" sx={{overflowX:true}}>{x.description}</TableCell>
                <TableCell align="center">{x.price}</TableCell>
                <TableCell align="center">{x.category}</TableCell>
                <TableCell align="center">
                  {x.sold == false ? "No" : "Yes"}
                </TableCell>
                <TableCell align="center">
                  <img src={x.image} width="50px" height="50px" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination> */}
        
      <Pagination count={Math.ceil(TransactionData?.total/10)}  
      onChange={(e,p)=>setAllTransactionsquery({...AllTransactionsquery, page : p})}/>


      {/* </TablePagination> */}
      <Statistics/>
      <Barchart/>

    </div>
  );
};

export default App;
