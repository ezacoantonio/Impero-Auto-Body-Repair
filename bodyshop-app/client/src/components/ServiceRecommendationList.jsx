import React, { useState } from "react";
import {
  Paper,
  Stack,
  Typography,
  Slider,
  Checkbox,
  FormControlLabel,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ServiceRecommendationDialog from "./ServiceRecommendationDialog";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function ServiceRecommendationList({
  client,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Service Recommendations</Typography>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={<AddCircleIcon />}
        >
          Add
        </Button>
      </Stack>
      <ServiceRecommendationDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={(data) => {
          setOpen(false);
          onAdd?.(data);
        }}
      />
      <Divider sx={{ my: 2 }} />
      <Stack spacing={1}>
        {client.serviceRecommendations?.map((r) => (
          <Paper key={r._id} sx={{ p: 1.5 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>
                {r.name} — ${Number(r.price).toFixed(2)}
              </Typography>
              <IconButton onClick={() => onDelete?.(r._id)}>
                <DeleteOutlineIcon />
              </IconButton>
            </Stack>
            <Stack spacing={1} sx={{ mt: 1 }}>
              <Slider
                value={r.progress}
                step={5}
                marks
                min={0}
                max={100}
                valueLabelDisplay="auto"
                onChange={(_, v) =>
                  onUpdate?.(r._id, { progress: v, done: v === 100 })
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(r.done)}
                    onChange={(e) =>
                      onUpdate?.(r._id, {
                        done: e.target.checked,
                        progress: e.target.checked
                          ? 100
                          : Math.min(r.progress, 99),
                      })
                    }
                  />
                }
                label="Done (100%)"
              />
            </Stack>
          </Paper>
        ))}
        {!client.serviceRecommendations?.length && (
          <Typography>No recommendations yet.</Typography>
        )}
      </Stack>
    </Paper>
  );
}
