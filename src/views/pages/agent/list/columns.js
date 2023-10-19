import React, { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

import { getInitials } from 'src/@core/utils/get-initials'
import { remove } from 'src/services/agent.service'
import { toast } from 'react-hot-toast'
import { formatDateWithTime } from 'src/@core/utils/format'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const userStatusObj = {
  1: 'success',
  pending: 'warning',
  0: 'secondary'
}

export const getColumns = ({ fetchAgent, toggleEditUserDrawer }) => {
  const renderClient = row => {
    if (row?.logo?.length) {
      return <CustomAvatar src={row.logo} sx={{ mr: 3, width: 34, height: 34 }} />
    } else {
      return (
        <CustomAvatar
          skin='light'
          color={row.avatarColor || 'primary'}
          sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
        >
          {getInitials(row.representativeName ? row.representativeName : 'John Doe')}
        </CustomAvatar>
      )
    }
  }

  const RowOptions = ({ id }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [open, setOpen] = useState(false)
    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = event => {
      setAnchorEl(event.currentTarget)
    }

    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }
    const handleEdit = id => {
      toggleEditUserDrawer(id)
      handleRowOptionsClose()
    }

    const handleClickOpen = () => {
      setOpen(true)
    }

    const handleClose = () => {
      setOpen(false)
      handleRowOptionsClose()
    }

    const handleDelete = async id => {
      const res = await remove(id)
      if (res?.success) {
        toast.success('Agent removed Successfully!')
        fetchAgent()
      } else {
        toast.error('Server error')
      }
      handleRowOptionsClose()
      handleClose()
    }

    return (
      <>
        <IconButton size='small' onClick={handleRowOptionsClick}>
          <Icon icon='mdi:dots-vertical' />
        </IconButton>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={handleRowOptionsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          PaperProps={{ style: { minWidth: '8rem' } }}
        >
          <MenuItem onClick={() => handleEdit(id)} sx={{ '& svg': { mr: 2 } }}>
            <Icon color='468B97' icon='mdi:pencil-outline' fontSize={20} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleClickOpen} sx={{ '& svg': { mr: 2 } }}>
            <Icon color='#a70000' icon='mdi:delete-outline' fontSize={20} />
            Delete
          </MenuItem>
        </Menu>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this user?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='primary'>
              No
            </Button>
            <Button onClick={() => handleDelete(id)} color='primary'>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }

  const columns = [
    {
      flex: 0.15,
      minWidth: 230,
      field: 'travelAgentId',
      headerName: 'Company',
      renderCell: ({ row }) => {
        const { companyName, akama, creditLimit } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', height: 'fit-content' }}>
                <Typography>
                  <strong>{companyName || ''}</strong>
                </Typography>
                <Typography noWrap variant='caption'>
                  <strong>Akama / NIC:</strong> {akama}
                </Typography>
                <Typography noWrap variant='caption'>
                  <strong>Credit Limit:</strong> {creditLimit}
                </Typography>
              </Box>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'fullName',
      headerName: 'User',
      renderCell: ({ row }) => {
        const { representativeName, email } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', height: 'fit-content' }}>
            <Typography>
              <strong>{representativeName}</strong>
            </Typography>
            <Typography noWrap variant='caption'>
              <strong>Email:</strong> {email}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.12,
      minWidth: 100,
      field: 'mobile',
      headerName: 'Contact',
      renderCell: ({ row }) => {
        const { mobile, landline } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', height: 'fit-content' }}>
            <Typography>{mobile}</Typography>
            <Typography noWrap variant='caption'>
              <strong>Landline: </strong> {landline}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 230,
      field: 'country',
      headerName: 'Country',
      renderCell: ({ row }) => {
        const { country, city } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', height: 'fit-content' }}>
              <Typography>
                <strong>{country}</strong>
              </Typography>
              <Typography noWrap variant='caption'>
                <strong>City:</strong> {city}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'createdAt',
      headerName: 'Created At',
      renderCell: ({ row }) => {
        const { createdAt } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Typography>{formatDateWithTime(createdAt)}</Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={row.status === 1 ? 'Active' : 'InActive'}
            color={userStatusObj[row.status]}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => <RowOptions id={row.id} />
    }
  ]

  return columns
}
