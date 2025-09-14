import {
  Alert,
  Autocomplete,
  CardContent,
  CardHeader,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import Modal from "./Modal";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CheckCircle, Info, WarningCircle, XCircle } from "phosphor-react";

export default function ProgressForm({
  setModalVisible,
  defaultContent,
  refreshProgress,
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: defaultContent.id ?? null,
      subject: defaultContent.subject ?? "",
      professional: defaultContent.professional ?? null,
      patient: defaultContent.patient ?? null,
    },
  });

  const [professionals, setProfessionals] = useState([
    defaultContent.professional,
  ]);
  const [patients, setPatients] = useState([defaultContent.patient]);

  const [inputSelectedProf, setInputSelectedProf] = useState(
    defaultContent.professional?.name ?? ""
  );
  const [inputSelectedPatient, setInputSelectedPatient] = useState(
    defaultContent.patient?.name ?? ""
  );

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severityMessage, setSeverityMessage] = useState("");
  const [loadingProf, setLoadingProf] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(false);

  async function fetchProfessionals(search) {
    const result = await window.professionalAPI.searchProfessionals(search);
    setProfessionals(result);
    setLoadingProf(false);
  }

  async function fetchPatients(search) {
    const sorting = { sortBy: "updatedAt", sortDir: "DESC" };
    const { patients } = await window.patientAPI.searchPatients(
      search,
      sorting
    );
    setPatients(patients);
    setLoadingPatient(false);
  }

  const changeInput = (input, setLoading, callbackOptions, callbackFetch) => {
    if (!input) {
      callbackOptions([]);
      setLoading(false);
      return;
    } else {
      setLoading(true);
    }

    callbackFetch(input);
  };

  useEffect(() => {
    changeInput(
      inputSelectedProf,
      setLoadingProf,
      setProfessionals,
      fetchProfessionals
    );
  }, [inputSelectedProf]);

  useEffect(() => {
    changeInput(
      inputSelectedPatient,
      setLoadingPatient,
      setPatients,
      fetchPatients
    );
  }, [inputSelectedPatient]);

  const validateIsEmpty = (field, isString) => {
    if (!field || (isString && field.trim() === "")) {
      return "Campo obrigatório";
    } else {
      return true;
    }
  };

  const validateEqualFields = (data) => {
    const equalSubject = defaultContent.subject === data.subject;
    const equalProfessional =
      defaultContent.professional.id === data.professional.id;
    const equalPatient = defaultContent.patient.id === data.patient.id;

    return !(equalSubject && equalProfessional && equalPatient);
  };

  async function registerProgress(progress, patient, toCreate) {
    const message = toCreate ? "cadastrada" : "atualizada";

    const response = toCreate
      ? await window.progressAPI.createProgress(progress)
      : await window.progressAPI.updateProgress(defaultContent.id, progress);

    if (response) {
      setSnackbarMessage(`Evolução ${message} com sucesso!`);
      setSeverityMessage("success");
      refreshProgress(patient);
    } else {
      setSnackbarMessage(
        "Não foi possível marcar esta consulta - Tente Novamente!"
      );
      setSeverityMessage("error");
    }
  }

  const onSubmit = async (data) => {
    const patient = data.patient;

    const progress = {
      subject: data.subject,
      patientId: patient.id,
      professionalId: data.professional.id,
    };

    if (defaultContent.subject) {
      if (validateEqualFields(data)) {
        registerProgress(progress, patient, false);
      } else {
        setSeverityMessage("warning");
        setSnackbarMessage("Não houve alteração nas informações");
      }
    } else {
      registerProgress(progress, patient, true);
    }

    setSnackbarOpen(true);
  };

  const onError = (errors) => {
    setSnackbarMessage("Preencha os campos apropriadamente!");
    setSeverityMessage("warning");
    setSnackbarOpen(true);
  };

  const handleCLose = async () => {
    setProfessionals([]);
    setPatients([]);
    reset();

    setModalVisible(false);
  };

  return (
    <Modal callback={handleCLose}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ top: "100px !important" }}
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
            success: <CheckCircle sx={{ color: "green" }} size={32} />,
            error: <XCircle sx={{ color: "red" }} size={32} />,
            warning: <WarningCircle sx={{ color: "orange" }} size={32} />,
            info: <Info sx={{ color: "blue" }} size={32} />,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div className="mx-3">
        <CardHeader
          title={"Cadastrar Evolução"}
          sx={{
            my: -0.5,
            "& .MuiCardHeader-title": {
              fontFamily: "'Poppins', sans-serif",
              fontSize: "1.25rem",
              fontWeight: 600,
            },
          }}
        />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <Grid container spacing={4}>
              <Grid item size={6}>
                <Controller
                  name="professional"
                  control={control}
                  rules={{ validate: (value) => validateIsEmpty(value, false) }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disablePortal
                      value={field.value}
                      options={professionals}
                      getOptionLabel={(option) =>
                        option ? option.name : option
                      }
                      onInputChange={(event, input) =>
                        setInputSelectedProf(input)
                      }
                      onChange={(_, value) => {
                        field.onChange(value);
                        setLoadingProf(false);
                      }}
                      loading={loadingProf}
                      loadingText="Pesquisando..."
                      sx={{ minWidth: "200px" }}
                      noOptionsText="Nenhum professional encontrado"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Profissional"
                          error={!!errors.professional}
                          helperText={errors.professional?.message}
                          fullWidth
                          className="custom-textfield-input"
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item size={6}>
                <Controller
                  name="patient"
                  control={control}
                  rules={{ validate: (value) => validateIsEmpty(value, false) }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disablePortal
                      value={field.value}
                      options={patients}
                      getOptionLabel={(option) => option.name}
                      onInputChange={(event, input) =>
                        setInputSelectedPatient(input)
                      }
                      onChange={(_, value) => {
                        field.onChange(value);
                        setLoadingPatient(false);
                      }}
                      loading={loadingPatient}
                      loadingText="Pesquisando..."
                      sx={{ minWidth: "200px" }}
                      noOptionsText="Nenhum paciente encontrado"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Paciente"
                          error={!!errors.patient}
                          helperText={errors.patient?.message}
                          fullWidth
                          className="custom-textfield-input"
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item size={12}>
                <TextField
                  label="Evolução"
                  multiline
                  rows={5}
                  {...register("subject", {
                    validate: (value) => validateIsEmpty(value, true),
                  })}
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
                  fullWidth
                  className="custom-textfield-input"
                />
              </Grid>
              <Grid
                item
                size={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: -2,
                }}
              >
                <input
                  type="submit"
                  className="button register-button rounded mx-auto block uppercase font-sans"
                  value="Salvar"
                />
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </Modal>
  );
}
