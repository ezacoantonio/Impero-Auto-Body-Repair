import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Checkbox,
  TextField,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const initialItems = [
  "Spare tire",
  "Jack",
  "Tire Tools",
  "Battery",
  "Oil and Radiator cap",
  "Carpets",
  "Side mirrors",
  "Headlight",
  "Tail light",
  "Radio module",
  "Odometer",
];

export default function VehicleItemsSection() {
  const [items, setItems] = useState(
    initialItems.map((item) => ({
      name: item,
      checked: false,
      condition: item.includes("light") ? "Good" : null,
    }))
  );
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([
        ...items,
        {
          name: newItem,
          checked: false,
          condition: null,
        },
      ]);
      setNewItem("");
    }
  };

  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        p: 2,
        height: "100%",
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Vehicle Items
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ maxHeight: 300, overflowY: "auto", mb: 2 }}>
        <List dense>
          {items.map((item, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <Checkbox
                checked={item.checked}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].checked = e.target.checked;
                  setItems(newItems);
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography>{item.name}</Typography>
                {item.name.includes("light") && (
                  <Typography variant="caption" color="text.secondary">
                    Condition: {item.condition}
                  </Typography>
                )}
              </Box>
              <IconButton onClick={() => handleDeleteItem(index)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ display: "flex", mt: 2 }}>
        <TextField
          fullWidth
          size="small"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddItem}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
}
