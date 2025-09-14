"use client";

import Schedule from "@/components/Schedule";
import "@/styles/main-menu.css";

import { useState } from "react";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RegistrationProf from "@/components/RegistrationProf";
import RegistrationPatient from "@/components/RegistrationPatient";
import Progress from "@/components/Progress";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import {
  IconButton,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Divider,
  Drawer,
  Box,
  Typography,
} from "@mui/material";
import {
  CaretLeft,
  DotsThreeOutlineVertical,
  Calendar,
  FolderUser,
  IdentificationCard,
  FirstAidKit,
  List as ListIcon,
  ClipboardText
} from "phosphor-react";
import ListPatients from "@/components/ListPatients";
import ListProfessionals from "@/components/ListProfessional";

export default function Page() {
  const drawerWidth = 190;
  const iconSize = 34;

  const [content, setContent] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme }) => ({
      flexGrow: 1,
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `calc(${theme.spacing(10)} + 1px)`,
      variants: [
        {
          props: ({ open }) => open,
          style: {
            transition: theme.transitions.create("margin", {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: `${drawerWidth}px`,
          },
        },
      ],
    })
  );

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: open ? "flex-end" : "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }));

  const sections = [
    {
      section: 0,
      name: "Agenda",
      icon: <Calendar size={iconSize} />,
      headerTitle: "Agendamento de Consultas"
    },
    {
      section: 1,
      name: "Profissionais",
      icon: <FirstAidKit size={iconSize} />,
      headerTitle: "Cadastro de Profissionais"
    },
    {
      section: 2,
      name: "Pacientes",
      icon: <IdentificationCard size={iconSize} />,
      headerTitle: "Cadastro de Pacientes"
    },
    {
      section: 3,
      name: "Evolução",
      icon: <ClipboardText size={iconSize} />,
      headerTitle: "Evolução de Pacientes"
    },
  ];

  const showContent = () => {
    switch (content) {
      case 0:
        return <Schedule />;
      case 1:
        return (
          <ListProfessionals />
        );
      case 2:
        return (
          <ListPatients
            setContent={setContent}
            setSelectedPatient={setSelectedPatient}
          />
        );
      default:
        return <Progress patient={selectedPatient} />;
    }
  };

  const handleSelectSection = (section) => {
    setContent(section);
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <div className="flex flex-col h-screen overflow-hidden">
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            "& .MuiDrawer-paper": {
              width: open ? drawerWidth : 80,
            },
          }}
        >
          <DrawerHeader>
            {open &&
              <IconButton  
              onClick={() => setOpen((prevState) => !prevState)}
              sx={{
                backgroundColor: "var(--color-button)",
                color: "white",
                "&:hover": {
                  backgroundColor: "#5DB7B9",
                },
              }}
            >
              <CaretLeft size={iconSize} />
            </IconButton>
            }
          </DrawerHeader>
          <Divider sx={{ mt: 3, mb: 1 }} />
          <List sx={{ mx: open ? "2px" : 0 }}>
            {sections.map((item) => (
              <ListItem
                key={item.name}
                disablePadding
                sx={{ display: "block", mb: 1.5 }}
              >
                <ListItemButton
                  selected={content === item.section}
                  sx={[
                    {
                      width: open ? "100%" : 44,
                      height: 44,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: open ? "flex-start" : "center",
                      mx: open ? 0 : "auto",
                      "&:hover": {
                        backgroundColor: "var(--color-button)",
                        color: "white",
                      },
                      "&:hover .MuiListItemIcon-root": {
                        color: "white",
                      },
                    },
                  ]}
                  onClick={() => handleSelectSection(item.section)}
                >
                  <Box sx={{ flexShrink: 0 }}>{item.icon}</Box>
                  {open && <ListItemText primary={item.name} sx={{ ml: 2 }} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Main open={open}>
          <div className="flex flex-col flex-auto" id="content">
            <div className="h-16 mt-3 mb-1 flex items-center">
              {!open &&
                <IconButton
                disableRipple
                onClick={() => setOpen((prevState) => !prevState)}
                sx={{
                  color: "var(--color-button)",
                  background: "white",
                  borderRadius: "4px",
                  "&:hover": {
                    background: "white",
                    color: "black", 
                  },
                }}
                >
                  <ListIcon size={iconSize} weight="fill" />
                </IconButton>
              }
              <div
                style={{ 
                  height: `calc(${iconSize}px + 1rem)`,
                  marginLeft: -15
                }} 
                className="bg-white rounded-[4px] flex items-center justify-center p-3.5 z-10">
                <Typography variant="body1" sx={{ color:"var(--color-button)", fontWeight: "bold" }}>
                  {sections[content].headerTitle}
                </Typography>
              </div>
            </div>
          </div>
          {showContent()}
        </Main>
      </div>
    </LocalizationProvider>
  );
}
