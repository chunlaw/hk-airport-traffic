import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers' 
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { Box, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Theme } from '@mui/material';
import * as csv from 'csvtojson';


const App = () =>  {
  const [startDate, setStartDate] = useState<Dayjs>( dayjs('2022-10-31') );
  const [endDate, setEndDate] = useState<Dayjs>( dayjs('2022-11-01') );
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('data.csv')
      .then(r => r.text())
      .then(data => {
        csv.default({})
        .fromString(data)
        .then(csvRow => {
          setData(
            csvRow.reduce((acc, cur) => {
              if ( acc[cur['Date']] === undefined ) acc[cur['Date']] = {}
              if ( acc[cur['Date']][cur['Control Point']] === undefined ) {
                acc[cur['Date']][cur['Control Point']] = {}
              }
              acc[cur['Date']][cur['Control Point']][cur['Arrival / Departure']] = {
                "Hong Kong Residents": cur["Hong Kong Residents"],
                "Mainland Visitors": cur["Mainland Visitors"],
                "Other Visitors": cur["Other Visitors"],
                "Total": cur["Total"],
              }
              return acc
            }, {})
          )
        })
      })
  }, [])

  return (
    <Box sx={rootSx}>
      <Box sx={datePickerSx}>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          localeText={{ start: 'Mobile start', end: 'Mobile end' }}
        >
          <MobileDatePicker
            label="Start Date"
            inputFormat='YYYY-MM-DD'
            value={startDate}
            onChange={(v) => setStartDate( v ?? dayjs('2022-10-31') )}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
          /
          <MobileDatePicker
            label="End Date"
            inputFormat='YYYY-MM-DD'
            value={endDate}
            onChange={(v) => setEndDate( v ?? dayjs('2022-11-01') )}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
        </LocalizationProvider>
      </Box>

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
          {Object.entries(data)
            .filter(([date, entry]) => {
              let ts = dayjs(date, 'DD-MM-YYYY').unix()
              return startDate.unix() <= ts && ts <= endDate.unix()
            })
            .map(([date, entry], idx) => (
              <TableRow key={idx}>
                <TableCell>{date}</TableCell>
                <TableCell>Airport</TableCell>
                <TableCell>{entry['Airport']['Departure']['Hong Kong Residents']}</TableCell>
                <TableCell>{entry['Airport']['Departure']['Mainland Visitors']}</TableCell>
                <TableCell>{entry['Airport']['Departure']['Other Visitors']}</TableCell>
                <TableCell>{entry['Airport']['Departure']['Total']}</TableCell>
                <TableCell>{entry['Airport']['Arrival']['Hong Kong Residents']}</TableCell>
                <TableCell>{entry['Airport']['Arrival']['Mainland Visitors']}</TableCell>
                <TableCell>{entry['Airport']['Arrival']['Other Visitors']}</TableCell>
                <TableCell>{entry['Airport']['Arrival']['Total']}</TableCell>
              </TableRow>
            ))
          }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default App;

const rootSx: SxProps<Theme> = {
  p: 2,
}

const datePickerSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 1,
}