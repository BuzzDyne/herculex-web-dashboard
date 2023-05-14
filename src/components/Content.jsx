import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { React, useEffect, useState} from 'react'
import axios from '../api/axios'

const Content = () => {
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