import { CardContent, CardHeader, Grid, TextField } from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { withMask } from "use-mask-input";

export default function RegistrationProf({
  professional,
  setModalVisible,
  setSnackbarOpen,
  setSeverityMessage,
  setSnackbarMessage,
  fetchProfessionals
}) {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      cpf: "",
      birthDate: null,
    },
  });

  async function createProfessional(professional) {
    const result = await window.professionalAPI.createProfessional(
      professional
    );
    if (result) {
      await fetchProfessionals();
      return { ...professional, id: result };
    }
    return result;
  }

  async function updateProfessional(professionalId, professional) {
    const result = await window.professionalAPI.updateProfessional(
      professionalId,
      professional
    );
    if (result) {
      await fetchProfessionals();
      return { ...professional, id: professionalId };
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
    if (field.replace(/\D/g, "").length !== 11) return "Telefone incompleto";
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

    if (!professional?.id) {
      result = await createProfessional(data);
      successMessage = `Paciente cadastrado com sucesso!`;
    } else {
      result = await updateProfessional(professional.id, data);
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
          title={
            (professional?.id ? "Atualizar" : "Cadastrar") + " Profissional"
          }
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
                size={6}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <input
                  type="submit"
                  className="button rounded uppercase font-sans"
                  value={professional?.id ? "Atualizar" : "Cadastrar"}
                />
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </>
  );
}
