import { XCircle } from "phosphor-react";
import { Typography } from "@mui/material";

export default function DeleteConfirmation({
  attribute,
  handleClose,
  handleDelete,
}) {
  return (
    <div className="flex flex-col justify-center items-center">
      <XCircle size={48} className="mb-1 text-red-700" />
      <Typography
        sx={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          fontSize: "18px",
          marginTop: "16px",
          marginBottom: "16px",
        }}
      >
        {attribute
          ? `Deseja excluir o cadastro de ${attribute}?`
          : "Deseja excluir esse registro?"}
      </Typography>
      <div className="flex flex-row justify-center mt-3.5">
        <button
          className="button rounded mr-4 uppercase font-sans"
          onClick={handleDelete}
        >
          Confirmar
        </button>
        <button
          className="button delete rounded uppercase font-sans"
          onClick={handleClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
