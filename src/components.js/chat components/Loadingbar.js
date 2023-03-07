import React from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loadingbar(props) {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Stack spacing={2} direction="row">
          <CircularProgress variant="determinate" value={props.value} />
        </Stack>
      </div>
    </div>
  );
}
