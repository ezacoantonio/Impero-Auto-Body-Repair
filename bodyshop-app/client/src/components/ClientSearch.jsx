import React, { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const useDebounce = (value, delay = 250) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

export default function ClientSearch({ fullWidthOnMobile = false }) {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(input, 250);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    (async () => {
      if (!debounced) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.get(
          `/clients/search?q=${encodeURIComponent(debounced)}`
        );
        if (active) setOptions(data || []);
      } catch {
        if (active) setOptions([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [debounced]);

  const getOptionLabel = useMemo(
    () => (opt) =>
      `${opt.fullName} — ${opt.plateNumber || "No plate"} — ${opt.phone || ""}`,
    []
  );

  return (
    <Autocomplete
      size="small"
      sx={{
        width: { xs: fullWidthOnMobile ? "100%" : 360, sm: 420, md: 520 },
        bgcolor: "white",
        borderRadius: 2,
      }}
      options={options}
      loading={loading}
      autoHighlight
      noOptionsText={input ? "No matches" : "Type to search…"}
      getOptionLabel={getOptionLabel}
      onChange={(_, value) => value?._id && navigate(`/client/${value._id}`)}
      inputValue={input}
      onInputChange={(_, val) => setInput(val)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search by name, phone, plate, make, model, year"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={16} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
