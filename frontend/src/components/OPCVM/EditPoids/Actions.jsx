import React from "react";
import { IconButton } from "@mui/material";
import { Edit, Lock, Trash, PieChart, Unlock } from "react-feather";
import { calculateSumClassification } from "../../../utils/OPCVM/helpers";
const Actions = ({
  params,
  setOpen,
  setPoids,
  setNewTitre,
  setOpenEdit,
  handleLock,
  rows,
  field,
  handleDelete,
}) => {
  return (
    <>
      <IconButton
        onClick={() => {
          const res = calculateSumClassification(
            rows,
            params.row.Classification,
            field
          );
          setOpen(true);
          setPoids(params.row[field].toFixed(2));
          setNewTitre(params.row.titre);
          console.log(res, "open");
        }}
      >
        <Edit size={18} color="var(--primary-color)" />
      </IconButton>
      <IconButton
        onClick={() => {
          setPoids(params.row[field].toFixed(2));
          setOpenEdit(true);
          setNewTitre(params.row.titre);
        }}
      >
        <PieChart size={18} color="var(--warning-color)" />
      </IconButton>
      <IconButton
        onClick={() => handleLock(params.row.titre, params.row.isLocked)}
      >
        {params.row.isLocked ? (
          <Lock size={18} color="var(--error-color)" />
        ) : (
          <Unlock size={18} color="var(--success-color)" />
        )}
      </IconButton>
      <IconButton onClick={() => handleDelete(params.row)}>
        <Trash size={18} color="var(--error-color)" />
      </IconButton>
    </>
  );
};

export default Actions;
