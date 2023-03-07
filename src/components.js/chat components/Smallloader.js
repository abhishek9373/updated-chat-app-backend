import React from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

export default function Smallloader(props) {
  return (
    <div>
      <div>
        <Stack spacing={2} direction="row">
          <CircularProgress variant="determinate" value={props.value} />
        </Stack>
      </div>
    </div>
  );
}
