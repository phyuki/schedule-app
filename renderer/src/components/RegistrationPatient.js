import { CardContent, CardHeader, Grid, TextField } from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { withMask } from "use-mask-input";

export default function RegistrationPatient({
  patient,
  setModalVisible,
  setSnackbarOpen,
  setSeverityMessage,
  setSnackbarMessage,
  fetchPatients
}) {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: patient?.name ?? "",
      address: patient?.address ?? "",
      phone: patient?.phone ?? "",
      cpf: patient?.cpf ?? "",
      birthDate: patient?.birthDate ? dayjs(patient?.birthDate) : null,
    },
  });

  async function createPatient(patient) {
    const result = await window.patientAPI.createPatient(patient);
    if (result) {
      await fetchPatients();
      return { ...patient, id: result };
    }
    return result;
  }

  async function updatePatient(patientId, patient) {
    const result = await window.patientAPI.updatePatient(patientId, patient);
    if (result) {
      await fetchPatients();
      return { ...patient, id: patientId };
    }
    return result;
  }

  const validateIsEmpty = (field) => {
    if (field.trim() === "") {
      return "Campo obrigatório";
    } else {
      return undefined;
    }
  };

  const validatePhoneNumber = (field) => {
    if (field.trim() === "") return "Campo obrigatório";
    if (field.replace(/\D/g, "").length !== 11) return "Telefone inválido";
    else return undefined;
  };

  const validateDateField = (date) => {
    if (!date) return "Campo obrigatório";
    if (!dayjs(date).isValid() || date.isAfter(dayjs(), "day"))
      return "Data inválida";
    else return true;
  };

  async function onSubmit(data) {
    let result = false,
      successMessage = "";

    if (!patient?.id) {
      result = await createPatient(data);
      successMessage = `Paciente cadastrado com sucesso!`;
    } else {
      result = await updatePatient(patient.id, data);
      successMessage = "Dados atualizados com sucesso!";
    }

    if (result) {
      setSnackbarMessage(successMessage);
      setSeverityMessage("success");
      setModalVisible(false);
    } else {
      setSeverityMessage("error");
      setSnackbarMessage(
        "Não foi possível efetuar esta operação - Tente Novamente!"
      );
    }

    setSnackbarOpen(true);
  }

  function onError(errors) {
    setSnackbarMessage("Preencha os campos apropriadamente!");
    setSeverityMessage("warning");
    setSnackbarOpen(true);
  }

  return (
    <>
      <div className="mx-3">
        <CardHeader
          title={(patient?.id ? "Atualizar" : "Cadastrar") + " Paciente"}
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
            <Grid container spacing={4.5}>
              <Grid item size={12}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ validate: (value) => validateIsEmpty(value) }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Nome completo"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      className="custom-textfield-input"
                    />
                  )}
                />
              </Grid>
              <Grid item size={12}>
                <Controller
                  name="address"
                  control={control}
                  rules={{ validate: (value) => validateIsEmpty(value) }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Endereço"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      className="custom-textfield-input"
                    />
                  )}
                />
              </Grid>
              <Grid item size={4}>
                <Controller
                  name="cpf"
                  control={control}
                  rules={{ validate: (value) => validateIsEmpty(value) }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="CPF"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      className="custom-textfield-input"
                      inputRef={withMask("999.999.999-99")}
                    />
                  )}
                />
              </Grid>
              <Grid item size={4}>
                <Controller
                  name="birthDate"
                  control={control}
                  rules={{ validate: (value) => validateDateField(value) }}
                  render={({ field }) => (
                    <DatePicker
                      label="Data de nascimento"
                      {...field}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          className: "custom-textfield-input",
                          error: !!errors.birthDate,
                          helperText: errors.birthDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item size={4}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ validate: (value) => validatePhoneNumber(value) }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Telefone"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      className="custom-textfield-input"
                      inputRef={withMask("(99) 99999-9999")}
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                size={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  my: -1
                }}
              >
                <input
                  type="submit"
                  className="button rounded uppercase font-sans"
                  value={patient?.id ? "Atualizar" : "Cadastrar"}
                />
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </>
  );
}
