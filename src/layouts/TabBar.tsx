
import React, { useState } from "react";
import { Box, Tabs, Tab, Paper, Button } from "@mui/material";

// Define the structure of each tab item
interface TabItem {
  label: string;
  children?: string[];
}

// Define the props the component receives
interface TabBarProps {
  tabsData: TabItem[];
}

const TabBar: React.FC<TabBarProps> = ({ tabsData }) => {
  const [activeParent, setActiveParent] = useState<number | null>(null);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  // Handle parent tab click
  const handleParentClick = (index: number) => {
    setActiveParent(index);
    setSelectedChild(null); // reset child selection
  };

  // Handle child tab click
  const handleChildClick = (child: string, parentIndex: number) => {
    setSelectedChild(child);
    setActiveParent(parentIndex);
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
          justifyContent: "space-evenly",
          position: "relative",
          // zIndex: 1200,
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
              py: 0,
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
          {tabsData.map((tab, idx) => (
            <Tab
              key={idx}
              label={tab.label}
              onClick={() => handleParentClick(idx)}
            />
          ))}
        </Tabs>
      </Paper>

      {/* CHILD TAB BAR – appears when a parent tab is clicked */}
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
          {tabsData[activeParent].children!.map((child, i) => (
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
