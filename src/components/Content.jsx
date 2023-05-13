import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { React, useEffect, useState} from 'react'
import axios from '../api/axios'

const Content = () => {
  // const tableData = [
  //   { id: 1, name: 'John', age: 25, city: 'New York' },
  //   { id: 2, name: 'Jane', age: 30, city: 'Los Angeles' },
  //   { id: 3, name: 'Bob', age: 40, city: 'Chicago' },
  //   { id: 4, name: 'Alice', age: 35, city: 'San Francisco' },
  //   { id: 11, name: 'John', age: 25, city: 'New York' },
  //   { id: 12, name: 'Jane', age: 30, city: 'Los Angeles' },
  //   { id: 13, name: 'Bob', age: 40, city: 'Chicago' },
  //   { id: 14, name: 'Alice', age: 35, city: 'San Francisco' },
  //   { id: 21, name: 'John', age: 25, city: 'New York' },
  //   { id: 22, name: 'Jane', age: 30, city: 'Los Angeles' },
  //   { id: 23, name: 'Bob', age: 40, city: 'Chicago' },
  //   { id: 24, name: 'Alice', age: 35, city: 'San Francisco' },
  //   { id: 31, name: 'John', age: 25, city: 'New York' },
  //   { id: 32, name: 'Jane', age: 30, city: 'Los Angeles' },
  //   { id: 33, name: 'Bob', age: 40, city: 'Chicago' },
  //   { id: 34, name: 'Alice', age: 35, city: 'San Francisco' },
  //   { id: 41, name: 'John', age: 25, city: 'New York' },
  //   { id: 42, name: 'Jane', age: 30, city: 'Los Angeles' },
  //   { id: 43, name: 'Bob', age: 40, city: 'Chicago' },
  //   { id: 44, name: 'Alice', age: 35, city: 'San Francisco' },
  //   { id: 51, name: 'John', age: 25, city: 'New York' },
  //   { id: 52, name: 'Jane', age: 30, city: 'Los Angeles' },
  //   { id: 53, name: 'Bob', age: 40, city: 'Chicago' },
  //   { id: 54, name: 'Alice', age: 35, city: 'San Francisco' },
  //   { id: 61, name: 'John', age: 25, city: 'New York' },
  //   { id: 62, name: 'Jane', age: 30, city: 'Los Angeles' },
  //   { id: 63, name: 'Bob', age: 40, city: 'Chicago' },
  //   { id: 64, name: 'Alice', age: 35, city: 'San Francisco' },
  //   { id: 71, name: 'John', age: 25, city: 'New York' },
  //   { id: 72, name: 'Jane', age: 30, city: 'Los Angeles' },
  //   { id: 73, name: 'Bob', age: 40, city: 'Chicago' },
  //   { id: 74, name: 'Alice', age: 35, city: 'San Francisco' },
  //   { id: 81, name: 'John', age: 25, city: 'New York' },
  //   { id: 82, name: 'Jane', age: 30, city: 'Los Angeles' },
  //   { id: 83, name: 'Bob', age: 40, city: 'Chicago' },
  //   { id: 84, name: 'Alice', age: 35, city: 'San Francisco' },
  //   { id: 91, name: 'John', age: 25, city: 'New York' },
  //   { id: 92, name: 'Jane', age: 30, city: 'Los Angeles' },
  //   { id: 93, name: 'Bob', age: 40, city: 'Chicago' },
  //   { id: 94, name: 'Alice', age: 35, city: 'San Francisco' },
  // ];

  const [orders, setOrders] = useState([])

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const getUsers = async () => {
      try {
        const response = await axios.get('/order/random_5_rows', {
          signal: controller.signal
        })

        console.log(response.data)
        isMounted && setOrders(response.data)
      } catch (err) {
        console.error(err)
      }
    }

    getUsers()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, []);

  return (
    <>
      Text
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>TokpedOrderID</TableCell>
              <TableCell>Creation Date</TableCell>
              <TableCell>TokpedStatus</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {tableData.map((row) => (
              <TableRow key={row.id}>
                <TableCell 
                  sx={{
                    cursor: 'default',
                    '&:hover': {
                      cursor: 'pointer',
                    },
                  }}
                  onClick={(e) => alert("Button of clicked!")}>
                  {row.id}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.city}</TableCell>
              </TableRow>
            ))} */}

            {orders.map((row) => (
              <TableRow key={row.id}>
                <TableCell 
                  sx={{
                    cursor: 'default',
                    '&:hover': {
                      cursor: 'pointer',
                    },
                  }}
                  onClick={(e) => alert(`Order ${row.id} is clicked!`)}>
                  {row.id}
                </TableCell>
                <TableCell>{row.ecom_order_id}</TableCell>
                <TableCell>{row.feeding_dt}</TableCell>
                <TableCell>{row.ecom_order_status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Content