// ** React Imports
import { useState, useEffect } from 'react'
// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'

import TableHeader from 'src/views/pages/user/list/TableHeader'
import AddUserDrawer from 'src/views/pages/user/list/AddUserDrawer'

import { getAll } from 'src/services/user.service'
import { toast } from 'react-hot-toast'

import { getColumns } from '../../../views/pages/user/list/columns'

const UserList = () => {
  // ** State
  const [value, setValue] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [userData, setUserdata] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [userId, setUserId] = useState(null)

  const fetchAgent = async () => {
    setLoading(true)
    const response = await getAll()
    if (response?.success) {
      setLoading(false)
      setUserdata(response?.data)
      toast.success(response?.message)
    } else {
      setLoading(false)
      setUserdata([])
      toast.error(response?.message)
    }
  }
  useEffect(() => {
    fetchAgent()
  }, [])

  const handleFilter = val => {
    setValue(val)
    if (val !== '') {
      const filteredData = userData?.filter(item =>
        Object.values(item).some(field => field?.toString().toLowerCase().includes(val.toLowerCase()))
      )

      setUserdata(filteredData)
    } else {
      fetchAgent()
    }
  }

  const toggleAddUserDrawer = () => {
    setUserId(null)
    setAddUserOpen(!addUserOpen)
  }
  const toggleEditUserDrawer = id => {
    setUserId(id)
    setAddUserOpen(!addUserOpen)
  }

  const columns = getColumns({ fetchAgent, toggleEditUserDrawer })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            pageTitle={'Users List'}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddUserDrawer}
          />
          <DataGrid
            autoHeight
            rowHeight={70}
            rows={userData || []}
            columns={columns}
            pageSize={pageSize}
            loading={isLoading}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 20, 50, 100]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>

      <AddUserDrawer userId={userId} open={addUserOpen} fetchData={fetchAgent} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export default UserList
