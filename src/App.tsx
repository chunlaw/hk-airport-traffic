import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers";
import {
  Box,
  Grid,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Theme,
} from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as csv from "csvtojson";

const App = () => {
  const [startDate, setStartDate] = useState<Dayjs>(dayjs("2021-01-01"));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs("2022-11-01"));
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("data.csv")
      .then((r) => r.text())
      .then((data) => {
        csv
          .default({})
          .fromString(data)
          .then((csvRow) => {
            setData(
              Object.entries(
                csvRow.reduce((acc, cur) => {
                  if (acc[cur["Date"]] === undefined) acc[cur["Date"]] = {};
                  if (acc[cur["Date"]][cur["Control Point"]] === undefined) {
                    acc[cur["Date"]][cur["Control Point"]] = {};
                  }
                  acc[cur["Date"]][cur["Control Point"]][
                    cur["Arrival / Departure"]
                  ] = {
                    "Hong Kong Residents": cur["Hong Kong Residents"],
                    "Mainland Visitors": cur["Mainland Visitors"],
                    "Other Visitors": cur["Other Visitors"],
                    Total: cur["Total"],
                  };
                  return acc;
                }, {})
              )
                .reduce((acc, [date, obj]) => {
                  acc.push({
                    date,
                    // @ts-ignore
                    ...obj,
                  });
                  return acc;
                }, [] as any[])
                .filter(({ date }) => {
                  let ts = dayjs(date, "DD-MM-YYYY").unix();
                  return startDate.unix() <= ts && ts <= endDate.unix();
                })
            );
          });
      });
  }, [setData, startDate, endDate]);

  return (
    <Box sx={rootSx}>
      <Box sx={datePickerSx}>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          localeText={{ start: "Mobile start", end: "Mobile end" }}
        >
          <MobileDatePicker
            label="Start Date"
            inputFormat="YYYY-MM-DD"
            value={startDate}
            onChange={(v) => setStartDate(v ?? dayjs("2022-10-31"))}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
          /
          <MobileDatePicker
            label="End Date"
            inputFormat="YYYY-MM-DD"
            value={endDate}
            onChange={(v) => setEndDate(v ?? dayjs("2022-11-01"))}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
        </LocalizationProvider>
      </Box>

      <Grid container>
        <Grid item md={6} sm={12}>
          <LineChart
            width={400}
            height={400}
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <XAxis dataKey="date" />
            <YAxis type="number" domain={[0, 20000]} />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Line
              type="monotone"
              dataKey="Airport.Arrival.Hong Kong Residents"
              stroke="#ff7300"
              yAxisId={0}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Airport.Departure.Hong Kong Residents"
              stroke="#387908"
              yAxisId={0}
              dot={false}
            />
          </LineChart>
        </Grid>
        <Grid item md={6} sm={12}>
          <LineChart
            width={400}
            height={400}
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <XAxis dataKey="date" />
            <YAxis type="number" domain={[0, 5000]} />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Line
              type="monotone"
              dataKey="Airport.Arrival.Mainland Visitors"
              stroke="#ff7300"
              yAxisId={0}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Airport.Departure.Mainland Visitors"
              stroke="#387908"
              yAxisId={0}
              dot={false}
            />
          </LineChart>
        </Grid>
        <Grid item md={6} sm={12}>
          <LineChart
            width={400}
            height={400}
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <XAxis dataKey="date" />
            <YAxis type="number" domain={[0, 3000]} />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Line
              type="monotone"
              dataKey="Airport.Arrival.Other Visitors"
              stroke="#ff7300"
              yAxisId={0}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Airport.Departure.Other Visitors"
              stroke="#387908"
              yAxisId={0}
              dot={false}
            />
          </LineChart>
        </Grid>
        <Grid item md={6} sm={12}>
          <LineChart
            width={400}
            height={400}
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <XAxis dataKey="date" />
            <YAxis type="number" domain={[0, 20000]} />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Line
              type="monotone"
              dataKey="Airport.Arrival.Total"
              stroke="#ff7300"
              yAxisId={0}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Airport.Departure.Total"
              stroke="#387908"
              yAxisId={0}
              dot={false}
            />
          </LineChart>
        </Grid>
      </Grid>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2}>Date</TableCell>
              <TableCell rowSpan={2}>Control_Point</TableCell>
              <TableCell colSpan={4}>Departure</TableCell>
              <TableCell colSpan={4}>Arrival</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>HK Resident</TableCell>
              <TableCell>Mainland Visitors</TableCell>
              <TableCell>Other Visitors</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>HK Resident</TableCell>
              <TableCell>Mainland Visitors</TableCell>
              <TableCell>Other Visitors</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .filter(({ date }) => {
                let ts = dayjs(date, "DD-MM-YYYY").unix();
                return startDate.unix() <= ts && ts <= endDate.unix();
              })
              .map(({ date, ...entry }, idx) => (
                <TableRow key={idx}>
                  <TableCell>{date}</TableCell>
                  <TableCell>Airport</TableCell>
                  <TableCell>
                    {entry["Airport"]["Departure"]["Hong Kong Residents"]}
                  </TableCell>
                  <TableCell>
                    {entry["Airport"]["Departure"]["Mainland Visitors"]}
                  </TableCell>
                  <TableCell>
                    {entry["Airport"]["Departure"]["Other Visitors"]}
                  </TableCell>
                  <TableCell>
                    {entry["Airport"]["Departure"]["Total"]}
                  </TableCell>
                  <TableCell>
                    {entry["Airport"]["Arrival"]["Hong Kong Residents"]}
                  </TableCell>
                  <TableCell>
                    {entry["Airport"]["Arrival"]["Mainland Visitors"]}
                  </TableCell>
                  <TableCell>
                    {entry["Airport"]["Arrival"]["Other Visitors"]}
                  </TableCell>
                  <TableCell>{entry["Airport"]["Arrival"]["Total"]}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default App;

const rootSx: SxProps<Theme> = {
  p: 2,
};

const datePickerSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 1,
};
