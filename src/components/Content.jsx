import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, TableSortLabel } from '@mui/material'
import { React, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import axios from '../api/axios'
import Title from './subcomponents/Title'

const Content = () => {
  const [orders, setOrders] = useState([])
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const getActiveOrders = async () => {
      try {
        const response = await axios.get('/api_order/get_active_orders', {
          signal: controller.signal
        })

        if (isMounted) {
          setOrders(response.data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
        }
      }
    }

    getActiveOrders()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortOrders = (data) => {
    if (sortField) {
      const sortedData = [...data].sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]

        if (aValue < bValue) {
          return sortDirection === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortDirection === 'asc' ? 1 : -1
        }
        return 0
      })

      return sortedData
    }

    return data
  }

  const sortedOrders = sortOrders(orders)

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Title sx={{ marginBottom: '4px'}}>Ongoing Orders</Title>
        <TableContainer component={Paper}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'id'}
                    direction={sortField === 'id' ? sortDirection : 'asc'}
                    onClick={() => handleSort('id')}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'ecom_order_id'}
                    direction={sortField === 'ecom_order_id' ? sortDirection : 'asc'}
                    onClick={() => handleSort('ecom_order_id')}
                  >
                    TokpedOrderID
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'feeding_dt'}
                    direction={sortField === 'feeding_dt' ? sortDirection : 'asc'}
                    onClick={() => handleSort('feeding_dt')}
                  >
                    Creation Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'ecom_order_status'}
                    direction={sortField === 'ecom_order_status' ? sortDirection : 'asc'}
                    onClick={() => handleSort('ecom_order_status')}
                  >
                    TokpedStatus
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedOrders.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Link to={`/order/${row.id}`}>
                      {row.id}
                    </Link>
                  </TableCell>
                  <TableCell>{row.ecom_order_id}</TableCell>
                  <TableCell>{row.feeding_dt}</TableCell>
                  <TableCell>{row.ecom_order_status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Grid>
  )
}

export default Content;
