import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowBackIosNew as ArrowBackIcon } from "@mui/icons-material";
import type { TabItem } from "../data/data";

interface TabBarProps {
  tabsData: TabItem[];
}

const TabBar: React.FC<TabBarProps> = ({ tabsData }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeParent, setActiveParent] = useState<number | null>(0);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  // Sync URL + Auto-select first child
  useEffect(() => {
    let found = false;
    let targetParentIndex: number | null = 0;
    let targetChildLabel: string | null = null;

    tabsData.forEach((parent, pIndex) => {
      // Match child path
      if (parent.children) {
        parent.children.forEach((child) => {
          if (location.pathname === child.path) {
            targetParentIndex = pIndex;
            targetChildLabel = child.label;
            found = true;
          }
        });
      }

      // Match parent path
      if (!found && location.pathname === parent.path) {
        targetParentIndex = pIndex;
        targetChildLabel = null;
        found = true;
      }
    });

    // Update state from URL
    setActiveParent(targetParentIndex);
    setSelectedChild(targetChildLabel);

    if (
      targetParentIndex !== null &&
      !found &&
      tabsData[targetParentIndex].children &&
      tabsData[targetParentIndex].children!.length > 0
    ) {
      const firstChild = tabsData[targetParentIndex].children![0];
      setSelectedChild(firstChild.label);
      navigate(firstChild.path, { replace: true });
    }
  }, [location.pathname, tabsData, navigate]);

  const handleParentClick = (index: number) => {
    const parent = tabsData[index];
    setActiveParent(index);

    if (parent.children && parent.children.length > 0) {
      const firstChild = parent.children[0];
      setSelectedChild(firstChild.label);
      navigate(firstChild.path);
    } else if (parent.path) {
      setSelectedChild(null);
      navigate(parent.path);
    }
  };

  const handleChildClick = (childPath: string, parentIndex: number, childLabel: string) => {
    setActiveParent(parentIndex);
    setSelectedChild(childLabel);
    navigate(childPath);
  };

  const showBackButton = location.pathname !== "/" && location.pathname !== "/home";

  return (
    <>
      {/* MAIN TAB BAR WITH BACK BUTTON */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: "primary.main",
          borderRadius: 0,
          display: "flex",
          alignItems: "center",
          // pt: 2,
          pb: 0,
          px: 4,
          gap: { xs: 2, md: 20 },
          position: "sticky",
          top: 0,
          zIndex: 1100,
          backdropFilter: "blur(8px)",
        }}
      >
        {/* SPECIAL BACK BUTTON */}
        {showBackButton && (
          <Button
            onClick={() => navigate('/clinics')}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              textTransform: "none",
              color: "white",
              fontWeight: 500,
              fontSize: "0.875rem",
              px: 1.5,
              py: 0.75,
              borderRadius: "8px",
              minWidth: "auto",
              bgcolor: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              transition: "all 0.2s ease-in-out",
              '&:hover': {
                bgcolor: "rgba(255, 255, 255, 0.22)",
                borderColor: "rgba(255, 255, 255, 0.6)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              },
              '&:active': {
                transform: "translateY(0)",
              },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Back
            </Typography>
          </Button>
        )}

        {/* PARENT TABS */}
        <Tabs
          value={activeParent}
          onChange={(_, i) => handleParentClick(i)}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            flex: 1,
            "& .MuiTab-root": {
              textTransform: "none",
              color: "rgba(255, 255, 255, 0.8)",
              minWidth: 130,
              fontWeight: 500,
              borderRadius: "8px 8px 0 0",
              mx: 0.5,
              py: 2,
              opacity: 0.9,
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.15)",
                color: "white",
                opacity: 1,
              },
            },
            "& .Mui-selected": {
              bgcolor: "rgba(255, 255, 255, 0.25)",
              color: "white !important",
              fontWeight: 600,
              opacity: 1,
              boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          {tabsData.map((tab, idx) => (
            <Tab key={idx} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      {/* CHILD TABS (Submenu) */}
      {activeParent !== null &&
        tabsData[activeParent]?.children &&
        tabsData[activeParent].children.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              bgcolor: "#fff",
              py: 1.5,
              px: 4,
              borderTop: "1px solid #e0e0e0",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            }}
          >
            {tabsData[activeParent].children.map((child, i) => (
              <Button
                key={i}
                variant={selectedChild === child.label ? "contained" : "outlined"}
                size="small"
                color="primary"
                onClick={() => handleChildClick(child.path, activeParent, child.label)}
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  minWidth: 120,
                  fontWeight: 500,
                  fontSize: "0.8125rem",
                  py: 0.75,
                  transition: "all 0.2s",
                  "&.MuiButton-contained": {
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  },
                  "&.MuiButton-outlined": {
                    borderColor: "#d0d0d0",
                    color: "text.primary",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "rgba(25, 118, 210, 0.04)",
                    },
                  },
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