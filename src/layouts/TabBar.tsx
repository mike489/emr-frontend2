import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import type { TabItem } from "../data/data";

interface TabBarProps {
  tabsData: TabItem[];
}

const TabBar: React.FC<TabBarProps> = ({ tabsData }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeParent, setActiveParent] = useState<number | null>(null);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  // Sync state with current URL
  useEffect(() => {
    let found = false;
    tabsData.forEach((parent, pIndex) => {
      if (parent.children) {
        parent.children.forEach((child) => {
          if (location.pathname === child.path) {
            setActiveParent(pIndex);
            setSelectedChild(child.label);
            found = true;
          }
        });
      }
      if (!found && location.pathname === parent.path) {
        setActiveParent(pIndex);
        setSelectedChild(null);
        found = true;
      }
    });
  }, [location.pathname, tabsData]);

  const handleParentClick = (index: number) => {
    const parent = tabsData[index];
    setActiveParent(index);
    setSelectedChild(null);

    // Navigate only if parent has no children
    if (!parent.children && parent.path) {
      navigate(parent.path);
    }
  };

  const handleChildClick = (childPath: string, parentIndex: number, childLabel: string) => {
    setActiveParent(parentIndex);
    setSelectedChild(childLabel);
    navigate(childPath);
  };

  return (
    <>
      {/* MAIN TAB BAR */}
      <Paper
        // elevation={1}
        sx={{
          bgcolor: "primary.main",
          borderRadius: 0,
          display: "flex",
          pt: 2,
          // mt: 8,
          px:4,
          justifyContent: "flex-start",
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
              py: 2,
              "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
            },
            "& .Mui-selected": {
              bgcolor: "rgba(255,255,255,0.25)",
              color: "white !important",
              fontWeight: 600,
            },
          }}
        >
          {tabsData.map((tab, idx) => (
            <Tab key={idx} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      {/* CHILD TAB BAR */}
      {activeParent !== null &&
        tabsData[activeParent].children &&
        tabsData[activeParent].children!.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              bgcolor: "#fff",
              py: 1,
              mt: 0,
              px: 4,
              borderTop: "1px solid #e0e0e0",
            }}
          >
            {tabsData[activeParent].children!.map((child, i) => (
              <Button
                key={i}
                variant={selectedChild === child.label ? "contained" : "outlined"}
                size="small"
                color="primary"
                onClick={() => handleChildClick(child.path, activeParent, child.label)}
                sx={{
                  textTransform: "none",
                  borderRadius: "4px",
                  minWidth: 120,
                }}
              >
                {child.label}
              </Button>
            ))}
          </Box>
        )}
    </>
  );
};

export default TabBar;
