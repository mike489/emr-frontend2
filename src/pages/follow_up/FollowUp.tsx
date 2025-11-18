import { Box } from '@mui/material'
import FollowUpListTable from '../../features/follow_up/FollowUpListTable'

export default function FollowUp() {
  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh', mt: -14 }}>
      <FollowUpListTable/>
    </Box>
  )
}
