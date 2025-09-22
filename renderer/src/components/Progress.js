import {
  Alert,
  Autocomplete,
  Card,
  CardContent,
  Pagination,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ProgressForm from "./ProgressForm";
import ProgressItem from "./ProgressItem";
import { CheckCircle, FilePdf, Info, ListPlus, NotePencil, WarningCircle, XCircle } from "phosphor-react";

export default function Progress({ patient }) {
  const [selected, setSelected] = useState(patient);
  const [searchInput, setSearchInput] = useState("");
  const [history, setHistory] = useState([]);

  const [patients, setPatients] = useState([patient]);
  const [loading, setLoading] = useState(false);

  const [formContent, setFormContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severityMessage, setSeverityMessage] = useState("");

  const [sorting, setSorting] = useState({
    page: 1,
    size: 3,
    totalPages: 0,
  });

  async function fetchProgress(patientId, page, size) {
    const history = await window.progressAPI.findProgressByPatient(
      patientId,
      page,
      size
    );
    setHistory(history?.rows);
    setSorting((sort) => {
      if (sort.totalPages === history.totalPages) return sort;
      return { ...sort, totalPages: history.totalPages };
    });
    console.log(history);
    if (history?.totalPages === 0) {
      setSnackbarMessage(`Não há registros cadastrados deste paciente!`);
      setSeverityMessage("error");
      setSnackbarOpen(true);
    }
  }

  async function updateOptions(search) {
    const sorting = { sortBy: "updatedAt", sortDir: "DESC" };
    const { patients } = await window.patientAPI.searchPatients(
      search,
      sorting
    );
    setPatients(patients);
    setLoading(false);
  }

  useEffect(() => {
    if (!searchInput) {
      setPatients([]);
      setLoading(false);
      return;
    } else {
      setLoading(true);
    }

    updateOptions(searchInput);
  }, [searchInput]);

  useEffect(() => {
    if (selected) 
      fetchProgress(selected.id, sorting.page, sorting.size);
  }, [sorting]);

  useEffect(() => {
    if (patient) {
      fetchProgress(patient.id, 0, sorting.size);
    }
  }, []);

  async function handleChange(event, selectedOption) {
    setSelected(selectedOption);
    setLoading(false);
    if (selectedOption) {
      setSorting((sort) => ({ ...sort, page: 1 }));
    } else {
      setSorting({ page: 1, size: 3, totalPages: 0 });
      setHistory([]);
    }
  }

  async function downloadProgress() {
    if (!selected) {
      setSnackbarMessage(`Selecione um paciente!`);
      setSeverityMessage("error");
      setSnackbarOpen(true);
      return;
    }
    const { patient, data } = await window.progressAPI.fetchAllProgress(selected.id);
    return window.reportAPI.createReport(patient, data);
  }

  const refreshProgress = (patient) => {
    setSorting((sort) => ({ ...sort, page: 1 }));
    setPatients([patient]);
    setSelected(patient);
    setSearchInput(patient.name);
  };

  const handleEditProgress = (progress) => {
    const content = {
      id: progress.id,
      subject: progress.subject,
      professional: progress.professional,
      patient: progress.patient,
    };

    setFormContent(content);
    setModalVisible(true);
  };

  function renderPatientHistory() {
    return history?.map((progress, index) => {
      return (
        <ProgressItem
          key={index}
          progress={{ ...progress, patient: selected }}
          handleEditProgress={handleEditProgress}
        />
      );
    });
  }

  function handlePageChange(event, value) {
    if (sorting.page !== value)
      setSorting((sort) => ({ ...sort, page: value }));
  }

  return (
    <>
      {modalVisible && (
        <ProgressForm
          setModalVisible={setModalVisible}
          defaultContent={formContent ?? { patient: selected }}
          refreshProgress={refreshProgress}
        />
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ top: "94px !important" }}
      >
        <Alert
          severity={severityMessage}
          sx={{
            backgroundColor: "#fff",
            color: "#333",
            border: "1px solid #ccc",
            boxShadow: 2,
            minWidth: "200px",
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
      <div className="flex flex-row items-center mt-2 mb-4">
        <Autocomplete
          className="min-w-2xs"
          disablePortal
          value={selected}
          options={patients}
          getOptionLabel={(option) => (option ? option.name : option)}
          onInputChange={(event, input) => setSearchInput(input)}
          onChange={handleChange}
          loading={loading}
          noOptionsText={"Nenhum paciente encontrado"}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{ maxWidth: 300, my: 1 }}
              className="custom-textfield-input"
              label={"Pacientes"}
            />
          )}
        />
        <Tooltip title="Cadastrar Evolução" arrow placement="top">
          <button
            className="button-submit main-icon"
            onClick={() => setModalVisible(true)}
          >
            <NotePencil size={32} />
          </button>
        </Tooltip>
        {!!selected &&
          <Tooltip title="Download Histórico" arrow placement="top">
            <button
              className="button-submit main-icon"
              onClick={downloadProgress}
            >
              <FilePdf size={32} />
            </button>
          </Tooltip>
        }
      </div>
      {sorting.totalPages > 0 && (
        <div className="flex flex-col flex-1">
          <Card className="!bg-white flex-grow mb-4">
            <CardContent className="overflow-y-auto h-[calc(100vh-250px)] max-h-[calc(100vh-250px)]">
              {renderPatientHistory()}
            </CardContent>
          </Card>
          <nav aria-label="Pagination" className="mt-auto mb-6 mx-auto block">
            <Pagination
              count={sorting.totalPages}
              shape="rounded"
              page={sorting.page}
              onChange={handlePageChange}
            />
          </nav>
        </div>
      )}
    </>
  );
}
