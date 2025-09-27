import { CircularProgress, Box } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          py: 4,
          px: 5,
          borderRadius: 3,
          bgcolor: 'white'
        }}
      >
        <CircularProgress color="inherit" size={46}/>
      </Box>
    </Box>
  );
}