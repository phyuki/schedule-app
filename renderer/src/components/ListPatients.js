import {
  Alert,
  createTheme,
  IconButton,
  Snackbar,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import {
  CheckCircle,
  ClipboardText,
  Info,
  MagnifyingGlass,
  NotePencil,
  Trash,
  UserCirclePlus,
  WarningCircle,
  XCircle,
} from "phosphor-react";
import { useRef, useState, useEffect } from "react";
import Modal from "./Modal";
import RegistrationPatient from "./RegistrationPatient";
import DeleteConfirmation from "./DeleteConfirmation";

export default function ListPatients({
  setContent,
  setSelectedPatient
}) {
  const theme = createTheme(ptBR);

  const pageSize = 10;
  const columns = [
    { field: "name", headerName: "Nome completo", flex: 3 },
    { field: "phone", headerName: "Telefone", flex: 3 },
    {
      field: "actions",
      headerName: "",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderHeader: (params) => (
        <NotePencil key={params.id} size={28} weight="fill" />
      ),
      renderCell: (params) => (
        <>
          <Tooltip title="Editar" arrow placement="top">
            <IconButton
              onClick={() => {
                setPatient(params.row);
                setModalVisible(true);
              }}
              size="small"
            >
              <NotePencil size={23} color="#000" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir" arrow placement="top">
            <IconButton
              onClick={() => { 
                setPatient(params.row)
                setConfirmationModal(true)
              }}
              size="small"
            >
              <Trash size={23} color="red" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Visualizar Evolução" arrow placement="top">
            <IconButton
              onClick={() => {
                setSelectedPatient(params.row)
                setContent(3)
              }}
              size="small"
            >
              <ClipboardText size={23} color="#000" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const inputRef = useRef();

  const [patient, setPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize,
  });
  const [rowCount, setRowCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [severityMessage, setSeverityMessage] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    console.log(paginationModel);
    fetchPatients(search);
  }, [paginationModel]);

  async function fetchPatients(search) {
    const sorting = {
      sortBy: "updatedAt",
      sortDir: "DESC",
      page: paginationModel.page + 1,
      size: pageSize,
    };
    const result = await window.patientAPI.searchPatients(
      search,
      sorting,
      true
    );
    setRowCount(result.total);
    setPatients(result.patients);
  }

  const onDeletePatient = async () => {
    const result = await window.patientAPI.deleteById(patient.id)
    if (result) {
        setSnackbarMessage("Paciente excluído com sucesso!")
        setSeverityMessage("success")
    } else {
        setSeverityMessage("error")
        setSnackbarMessage("Não foi possível efetuar esta operação - Tente Novamente!")
    }
    setSnackbarOpen(true)
    setConfirmationModal(false)
    if (result) {
      fetchPatients()
    }
  };

  const handleSearchChange = async (event) => {
    if (event.key === "Enter") {
      await fetchPatients(search);
      inputRef.current?.blur();
    }
  };

  const handleCLose = async () => {
    setPatient(null);
    setModalVisible(false);
  };

  const handleConfirmationClose = async () => {
    setConfirmationModal(false);
  }

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ top: "40px !important", marginRight: "-15px" }}
      >
        <Alert
          severity={severityMessage}
          sx={{
            backgroundColor: "#fff",
            color: "#333",
            border: "1px solid #ccc",
            boxShadow: 2,
            minWidth: "300px",
            alignItems: "center",
            marginRight: 2,
          }}
          iconMapping={{
            success: <CheckCircle sx={{ color: "green" }} size={40} />,
            error: <XCircle sx={{ color: "red" }} size={40} />,
            warning: <WarningCircle sx={{ color: "orange" }} size={40} />,
            info: <Info sx={{ color: "blue" }} size={40} />,
          }}
        >
          <Typography fontWeight="bold">{snackbarMessage}</Typography>
        </Alert>
      </Snackbar>
      {modalVisible && (
        <Modal callback={handleCLose}>
          <RegistrationPatient
            patient={patient}
            setModalVisible={setModalVisible}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            setSeverityMessage={setSeverityMessage}
            fetchPatients={fetchPatients}
          />
        </Modal>
      )}
      {confirmationModal && (
        <Modal 
          callback={handleConfirmationClose}
          className={"modal w-[30%]"}
        >
          <DeleteConfirmation
            attribute={patient.name}
            handleClose={handleConfirmationClose}
            handleDelete={onDeletePatient}
          />
        </Modal>
      )}
      <div className="flex flex-row items-center mt-2 mb-4">
        <TextField
          placeholder="Pesquisa por nome"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchChange}
          inputRef={inputRef}
          sx={{ maxWidth: 300, my: 1 }}
          className="custom-textfield-input"
          slotProps={{
            input: {
              endAdornment: <MagnifyingGlass size={25} />,
            },
          }}
        />
        <Tooltip title="Cadastrar Paciente" arrow placement="top">
          <button
            className="button-submit main-icon"
            onClick={() => setModalVisible(true)}
          >
            <UserCirclePlus size={32} />
          </button>
        </Tooltip>
      </div>
      <div style={{ marginBottom: 12 }}>
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={patients}
            columns={columns.map((c) => ({ ...c, sortable: false }))}
            rowCount={rowCount}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            paginationMode="server"
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize,
                },
              },
            }}
            pageSizeOptions={[pageSize]}
            disableColumnResize
            disableColumnMenu
            disableRowSelectionOnClick
            sx={{ 
              borderRadius: "5px", 
              fontFamily: "'Poppins', sans-serif",
              fontSize: 14, 
            }}
          />
        </ThemeProvider>
      </div>
    </>
  );
}
