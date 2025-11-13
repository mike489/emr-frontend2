/* TabBar.tsx */
import React, { useState } from "react";
import { Box, Tabs, Tab, Paper, Button } from "@mui/material";

interface TabItem {
  label: string;
  children?: string[];
}

const tabsData: TabItem[] = [
  { label: "Patients", children: ["All Patients", "New Patient", "Follow-up"] },
  { label: "Investigations", children: ["Lab Tests", "Imaging", "Reports"] },
  {
    label: "Info",
    children: [
      "OR List", "GA Cases OR List", "Power BI", "Laser Room",
      "Req Appts", "Comp Appts", "Inpatient Cases", "Visual Impaired",
      "Patient Search", "Central Patient Search", "My Cases",
      "Feedback Report", "Cross Info",
    ],
  },
  { label: "Referrals", children: ["To Specialists", "From Clinics"] },
  { label: "Checkedout Patients", children: ["Today", "This Week"] },
  { label: "Alerts", children: ["Critical", "Reminders"] },
  { label: "Quick Speak", children: ["Voice Notes", "Dictations"] },
  { label: "Templates", children: ["Forms", "Letters", "Prescriptions"] },
  { label: "Settings", children: ["Profile", "Preferences"] },
  { label: "Logout" },
];

const TabBar: React.FC = () => {
  const [activeParent, setActiveParent] = useState<number | null>(null);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  // Click parent → show children, reset child
  const handleParentClick = (index: number) => {
    setActiveParent(index);
    setSelectedChild(null);
  };

  // Click child → select it + keep parent active + update tab label
  const handleChildClick = (child: string, parentIndex: number) => {
    setSelectedChild(child);
    setActiveParent(parentIndex); // keeps parent tab selected
  };

  // Compute what to show in the parent tab
  const getTabLabel = (index: number) => {
    if (activeParent === index && selectedChild) {
      return selectedChild; 
    }
    return tabsData[index].label;
  };

  return (
    <>
      {/* MAIN TAB BAR */}
      <Paper
        elevation={1}
        sx={{
          bgcolor: "primary.main",
          borderRadius: 0,
          display: "flex",
          justifyContent: "center",
          position: "relative",
          zIndex: 1200,
        }}
      >
        <Tabs
          value={activeParent}
          onChange={(_, i) => handleParentClick(i)}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              color: "white",
              minWidth: 130,
              fontWeight: 500,
              borderRadius: "8px 8px 0 0",
              mx: 0.5,
              py: 1.2,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.15)",
              },
            },
            "& .Mui-selected": {
              bgcolor: "rgba(255,255,255,0.25)",
              color: "white !important",
              fontWeight: 600,
            },
          }}
        >
          {tabsData.map((_tab, idx) => (
            <Tab
              key={idx}
              label={getTabLabel(idx)}
              onClick={() => handleParentClick(idx)}
            />
          ))}
        </Tabs>
      </Paper>

      {/* CHILD TAB BAR */}
      {activeParent !== null && tabsData[activeParent].children && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            bgcolor: "#fff",
            py: 1,
            flexWrap: "wrap",
            gap: 1,
            mt: 0,
            px: 4,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          {tabsData[activeParent].children.map((child, i) => (
            <Button
              key={i}
              variant={selectedChild === child ? "contained" : "outlined"}
              size="small"
              color="primary"
              onClick={() => handleChildClick(child, activeParent)}
              sx={{
                textTransform: "none",
                borderRadius: "4px",
                minWidth: 100,
              }}
            >
              {child}
            </Button>
          ))}
        </Box>
      )}
    </>
  );
};

export default TabBar;