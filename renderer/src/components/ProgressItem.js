import { Button, Card, CardContent, CardHeader, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import { PencilSimple } from "phosphor-react";
import { useState } from "react";

export default function ProgressItem({ progress, handleEditProgress }) {
  const { title, professional, updatedAt, subject } = progress;
  const lastUpdate = dayjs(updatedAt).format("DD/MM/YYYY HH:mm");

  const [expanded, setExpanded] = useState(false);

  return (
    <Card sx={{ bgcolor: "white", borderRadius: "5px", m: "10px", p: "5px" }}>
      <CardHeader
        action={
          <div className="flex flex-row items-center">
              <button
                className="edit-button"
                onClick={() => handleEditProgress(progress)}
              >
              <Tooltip title="Editar" arrow placement="top">
                <PencilSimple size={30} weight="fill" />
              </Tooltip>
              </button>
          </div>
        }
        title={
          <Typography
            variant="h5"
            fontWeight="bold"
          >{`${title}ª evolução`}</Typography>
        }
        subheader={
          <div>
            <Typography variant="body2">
              Criado e assinado por{" "}
              <span className="font-semibold">{professional.name}</span>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Atualizado por último em {lastUpdate}
            </Typography>
          </div>
        }
      />
      <CardContent sx={{ mt: "-5px" }}>
        <Typography
          sx={{
            textAlign: "justify",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: expanded ? "none" : 3, 
          }}
        >
          {subject}
        </Typography>
        <Button
          size="small"
          onClick={() => setExpanded(!expanded)}
          sx={{
            fontSize: "0.75rem",
            p: "0 !important",
            fontWeight: "600",
            color: "var(--color-button)", 
            "&:hover": {
              color: "var(--color-hover-button)", 
              backgroundColor: "transparent", 
            },
          }}
        >
          {expanded ? "Ver Menos" : "Ver Mais"}
        </Button>
      </CardContent>
    </Card>
  );
}
