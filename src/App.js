import React, { useState } from 'react';
import {
  Checkbox,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Box,
  Grid,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './App.css';

function WorkOrder() {
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedActivities, setExpandedActivities] = useState({});
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedWorkItems, setSelectedWorkItems] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const packages = [
    { id: 1, name: 'Civil 1', rate: 567.80, total: '₹ 2,98,6792' },
    { id: 2, name: 'Civil 2', rate: 567.80, total: '₹ 2,98,6792' },
    { id: 3, name: 'Civil 3', rate: 567.80, total: '₹ 2,98,6792' },
    { id: 4, name: 'Civil 4', rate: 567.80, total: '₹ 2,98,6792' },
    { id: 5, name: 'Civil 5', rate: 567.80, total: '₹ 2,98,6792' },
  ];

  const handleExpandClick = (packageId) => {
    setExpandedRows((prev) => ({ ...prev, [packageId]: !prev[packageId] }));
  };

  const handleActivityExpandClick = (packageId, activityIndex) => {
    const key = `${packageId}-${activityIndex}`;
    setExpandedActivities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePackageChange = (event, packageId) => {
    const updatedPackages = [...selectedPackages];
    if (event.target.checked) {
      updatedPackages.push(packageId);
      const allWorkItemKeys = Array.from({ length: 4 }, (_, activityIndex) => {
        return Array.from({ length: 4 }, (_, workItemIndex) => `${packageId}-${activityIndex}-${workItemIndex}`);
      }).flat();
      setSelectedWorkItems((prev) => [...new Set([...prev, ...allWorkItemKeys])]);
    } else {
      const index = updatedPackages.indexOf(packageId);
      if (index > -1) updatedPackages.splice(index, 1);
      const allWorkItemKeys = Array.from({ length: 4 }, (_, activityIndex) => {
        return Array.from({ length: 4 }, (_, workItemIndex) => `${packageId}-${activityIndex}-${workItemIndex}`);
      }).flat();
      setSelectedWorkItems((prev) => prev.filter(item => !allWorkItemKeys.includes(item)));
    }
    setSelectedPackages(updatedPackages);
  };

  const handleWorkItemChange = (event, packageId, activityIndex, workItemIndex) => {
    const updatedWorkItems = [...selectedWorkItems];
    const workItemKey = `${packageId}-${activityIndex}-${workItemIndex}`;
    if (event.target.checked) {
      updatedWorkItems.push(workItemKey);
    } else {
      updatedWorkItems.splice(updatedWorkItems.indexOf(workItemKey), 1);
    }
    const allWorkItemsInActivity = Array.from({ length: 4 }, (_, j) => `${packageId}-${activityIndex}-${j}`);
    const allSelected = allWorkItemsInActivity.every(item => updatedWorkItems.includes(item));
    setSelectedWorkItems(updatedWorkItems);
    const activityCheckbox = document.getElementById(`activity-${packageId}-${activityIndex}`);
    if (activityCheckbox) {
      activityCheckbox.checked = allSelected;
    }
  };

  const handleActivitySelectAll = (event, packageId, activityIndex) => {
    const updatedWorkItems = [...selectedWorkItems];
    const allWorkItemsInActivity = Array.from({ length: 4 }, (_, j) => `${packageId}-${activityIndex}-${j}`);

    if (event.target.checked) {
      allWorkItemsInActivity.forEach((workItemKey) => {
        if (!updatedWorkItems.includes(workItemKey)) {
          updatedWorkItems.push(workItemKey);
        }
      });
    } else {
      allWorkItemsInActivity.forEach((workItemKey) => {
        const index = updatedWorkItems.indexOf(workItemKey);
        if (index > -1) updatedWorkItems.splice(index, 1);
      });
    }
    
    setSelectedWorkItems(updatedWorkItems);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'other') {
      setMessage('Hello World!');
    } else {
      setMessage('');
    }
  };

  const handleSave = () => {
    const selectedData = selectedPackages.map(pkgId => {
      const selectedItemsForPackage = Array.from({ length: 4 }, (_, activityIndex) => {
        return Array.from({ length: 4 }, (_, workItemIndex) => {
          const workItemKey = `${pkgId}-${activityIndex}-${workItemIndex}`;
          return selectedWorkItems.includes(workItemKey) ? workItemKey : null;
        }).filter(Boolean);
      }).flat();
      return {
        packageId: pkgId,
        workItems: selectedItemsForPackage
      };
    });
    console.log('Selected Data:', selectedData);
    setMessage('Work order saved successfully!');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Create Workorder
          </Typography>
        </Grid>

        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#20b2aa', color: '#fff' }}
            onClick={handleSave}
          >
            Save
          </Button>
        </Grid>

        <Grid item xs={12} sx={{ marginBottom: 2 }}>
          <Typography
            variant="h6"
            sx={{
              display: 'inline',
              cursor: 'pointer',
              textDecoration: activeTab === 'overview' ? 'underline' : 'none',
              marginRight: 2,
            }}
            onClick={() => handleTabChange('overview')}
          >
            Overview
          </Typography>
          <Typography
            variant="h6"
            sx={{
              display: 'inline',
              cursor: 'pointer',
              textDecoration: activeTab === 'other' ? 'underline' : 'none',
            }}
            onClick={() => handleTabChange('other')}
          >
            Other
          </Typography>
        </Grid>

        {activeTab === 'other' ? (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Hello World!
            </Typography>
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              <TableContainer sx={{ backgroundColor: 'transparent', borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell sx={{ width: '50%' }}>Packages</TableCell>
                      <TableCell sx={{ width: '25%' }}>Rate (in sqft)</TableCell>
                      <TableCell sx={{ width: '25%' }}>Total</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {packages.map((pkg) => (
                      <React.Fragment key={pkg.id}>
                        <TableRow>
                          <TableCell>
                            <Checkbox
                              checked={selectedPackages.includes(pkg.id)}
                              onChange={(event) => handlePackageChange(event, pkg.id)}
                            />
                          </TableCell>
                          <TableCell>{pkg.name}</TableCell>
                          <TableCell>{pkg.rate}</TableCell>
                          <TableCell>{pkg.total}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleExpandClick(pkg.id)}
                              size="small"
                              sx={{ color: '#20b2aa' }}
                            >
                              {expandedRows[pkg.id] ? <RemoveIcon /> : <AddIcon />}
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} sx={{ padding: 0 }}>
                            <Collapse in={expandedRows[pkg.id]} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 1 }}>
                                {Array.from({ length: 4 }, (_, i) => (
                                  <Box key={i}>
                                    <Grid container alignItems="center">
                                      <Grid item xs={1}>
                                        <Checkbox
                                          id={`activity-${pkg.id}-${i}`}
                                          checked={selectedWorkItems.includes(`${pkg.id}-${i}`) || 
                                                  Array.from({ length: 4 }, (_, j) => `${pkg.id}-${i}-${j}`).every(workItem => selectedWorkItems.includes(workItem))}
                                          onChange={(event) => handleActivitySelectAll(event, pkg.id, i)}
                                        />
                                      </Grid>
                                      <Grid item xs={10}>
                                        <Typography
                                          variant="body1"
                                          sx={{ flexGrow: 1 }}
                                        >
                                          Activity {i + 1}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={1}>
                                        <IconButton
                                          onClick={() => handleActivityExpandClick(pkg.id, i)}
                                          size="small"
                                          sx={{ color: '#20b2aa', marginLeft: 'auto' }}
                                        >
                                          {expandedActivities[`${pkg.id}-${i}`] ? <RemoveIcon /> : <AddIcon />}
                                        </IconButton>
                                      </Grid>
                                    </Grid>
                                    <Collapse in={expandedActivities[`${pkg.id}-${i}`]} timeout="auto" unmountOnExit>
                                      <Box sx={{ marginLeft: 2, marginTop: 1 }}>
                                        {Array.from({ length: 4 }, (_, j) => (
                                          <Grid container alignItems="center" key={j} sx={{ marginBottom: 1 }}>
                                            <Grid item xs={1}>
                                              <Checkbox
                                                checked={selectedWorkItems.includes(`${pkg.id}-${i}-${j}`)}
                                                onChange={(event) => handleWorkItemChange(event, pkg.id, i, j)}
                                              />
                                            </Grid>
                                            <Grid item xs={11}>
                                              <Typography variant="body2">Work Item {j + 1}</Typography>
                                            </Grid>
                                          </Grid>
                                        ))}
                                      </Box>
                                    </Collapse>
                                  </Box>
                                ))}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </>
        )}
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={message || "Selected Data logged in console."}
      />
    </Box>
  );
}

export default WorkOrder;