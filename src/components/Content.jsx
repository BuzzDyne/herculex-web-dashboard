import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, TableSortLabel } from '@mui/material'
import { React, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from '../api/axios'
import Title from './subcomponents/Title'

const Content = ({ apiAddress, title }) => {
  const [orders, setOrders] = useState([])
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const getActiveOrders = async () => {
      try {
        const response = await axios.get(apiAddress, {
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
  }, [apiAddress])

  const handleSort = (field) => {
    // Disable sorting for _dt columns
    if (field.endsWith('_dt')) {
      return;
    }
  
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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

  const formatUserDeadlinePrd = (userDeadlinePrd) => {
    if (!userDeadlinePrd) {
      return '-';
    }
  
    const [year, month, day] = [
      userDeadlinePrd.substring(0, 4),
      userDeadlinePrd.substring(4, 6),
      userDeadlinePrd.substring(6),
    ];
  
    return `${year}-${month}-${day}`;
  };

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Title sx={{ marginBottom: '4px'}}>{title}</Title>
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
                    active={sortField === 'invoice_ref'}
                    direction={sortField === 'invoice_ref' ? sortDirection : 'asc'}
                    onClick={() => handleSort('invoice_ref')}
                  >
                    Invoice Ref
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'user_deadline_prd'}
                    direction={sortField === 'user_deadline_prd' ? sortDirection : 'asc'}
                    onClick={() => handleSort('user_deadline_prd')}
                  >
                    User Deadline
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'design_sub_dt'}
                    direction={sortField === 'design_sub_dt' ? sortDirection : 'asc'}
                    onClick={() => handleSort('design_sub_dt')}
                  >
                    Design Submission
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'design_acc_dt'}
                    direction={sortField === 'design_acc_dt' ? sortDirection : 'asc'}
                    onClick={() => handleSort('design_acc_dt')}
                  >
                    Design Approval
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'print_done_dt'}
                    direction={sortField === 'print_done_dt' ? sortDirection : 'asc'}
                    onClick={() => handleSort('print_done_dt')}
                  >
                    Printing
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'packing_done_dt'}
                    direction={sortField === 'packing_done_dt' ? sortDirection : 'asc'}
                    onClick={() => handleSort('packing_done_dt')}
                  >
                    Packing
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'shipped_dt'}
                    direction={sortField === 'shipped_dt' ? sortDirection : 'asc'}
                    onClick={() => handleSort('shipped_dt')}
                  >
                    Shipped
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
                  <TableCell>{row.invoice_ref || '-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{formatUserDeadlinePrd(row.user_deadline_prd)}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{row.design_sub_dt   ? <CheckCircleIcon style={{ color: 'green' }} /> : '-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{row.design_acc_dt   ? <CheckCircleIcon style={{ color: 'green' }} /> : '-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{row.print_done_dt   ? <CheckCircleIcon style={{ color: 'green' }} /> : '-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{row.packing_done_dt ? <CheckCircleIcon style={{ color: 'green' }} /> : '-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{row.shipped_dt      ? <CheckCircleIcon style={{ color: 'green' }} /> : '-'}</TableCell>
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
