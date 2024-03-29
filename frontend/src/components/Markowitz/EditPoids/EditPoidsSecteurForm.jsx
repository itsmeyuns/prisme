import React, { useState, useEffect } from "react";
import {
  calculateFinalSum,
  calculateMaxSlider,
  calculateSumSecteur,
  combinePoidsAndLockStates,
  isReachMax,
  poidsFinalFunc,
  poidsFinalFunc2,
  poidsIntFun,
  poidsModFun,
  poidsNulleFunc,
  preReliquatFunc,
  reliquatFunc,
  sliderModFun,
  updatepoidsFinal,
} from "../../../utils/Markowitz/helpers";
import {
  IconButton,
  Typography,
  Button,
  Box,
  Divider,
  TextField,
  Slider,
} from "@mui/material";
import { Lock, Unlock } from "react-feather";

const EditPoidsSecteurForm = ({
  rows,
  setNewRows,
  titre,
  poids,
  field,
  reset,
}) => {
  console.log("New Titre", titre);
  const { SECTEUR_ACTIVITE } = rows.find((row) => row.titre === titre);
  const { sum } = calculateSumSecteur(rows, SECTEUR_ACTIVITE, field);
  const max = +sum.toFixed(2);
  const sameSecteur = rows.filter(
    (row) => row.SECTEUR_ACTIVITE === SECTEUR_ACTIVITE
  );

  const [inputValues, setInputValues] = useState(
    sameSecteur.reduce((acc, item) => {
      acc[item.titre] = +item[field].toFixed(2);
      return acc;
    }, {})
  );
  const oldPoids = sameSecteur.reduce((acc, item) => {
    acc[item.titre] = +item[field].toFixed(2);
    return acc;
  }, {});
  const [isLockedStates, setIsLockedStates] = useState(
    sameSecteur.reduce((acc, item) => {
      acc[item.titre] = false;
      return acc;
    }, {})
  );

  const [isModifiedStates, setIsModifiedStates] = useState(
    sameSecteur.reduce((acc, item) => {
      acc[item.titre] = false;
      return acc;
    }, {})
  );

  const list = combinePoidsAndLockStates(
    inputValues,
    isLockedStates,
    isModifiedStates
  );
  console.log("list", list);
  console.log("poids", oldPoids);
  const maxSlider = calculateMaxSlider(max, list);
  console.log(maxSlider, "inputValues", inputValues);
  const newPoids = inputValues;
  const sliderMod = sliderModFun(list, newPoids, maxSlider);
  console.log("sliderMod", sliderMod);
  const poidsInt = poidsIntFun(list, sliderMod);
  console.log("poidsInt", poidsInt);
  const poidsMod = poidsModFun(list, poidsInt);
  console.log("poidsMod", poidsMod);
  const preReliquat = preReliquatFunc(list, oldPoids);
  console.log("preReliquat", preReliquat);
  const poidsNulle = poidsNulleFunc(list, preReliquat, oldPoids, max, poidsMod);
  console.log("poidsNulle", poidsNulle);
  const reliquat = reliquatFunc(max, poidsInt);
  console.log("reliquat", reliquat);
  let poidsFinal = poidsFinalFunc(
    list,
    poidsInt,
    poidsMod,
    reliquat,
    poidsNulle
  );
  const poidsFinal2 = poidsFinalFunc2(list, poidsInt, poidsMod, reliquat);
  console.log("poidsFinal before", poidsFinal);
  const { isMax, titre: isMaxTitre } = isReachMax(poidsFinal, max);
  updatepoidsFinal(poidsFinal, isMax, isMaxTitre);
  const sumPoidsFinal = calculateFinalSum(poidsFinal);
  const validPoidsFinal = sumPoidsFinal === max;
  console.log("updatedPoidsFinal", poidsFinal);
  const handleInputChange = (titre, value) => {
    console.log("Change Titre", titre, value);
    setIsModifiedStates((prevValues) => ({
      ...prevValues,
      [titre]: true,
    }));
    setInputValues((prevValues) => ({
      ...prevValues,
      [titre]: +value,
    }));
    // handleLock(titre);

    // setInputValues((prevValues) => {
    //   const updatedValues = { ...prevValues };
    //   if (isMax) {
    //     Object.keys(poidsFinal).map((item) => {
    //       if (isModifiedStates[item] && isMax && isMaxTitre !== item) {
    //         updatedValues[item] = poidsFinal[item];
    //       }
    //     });
    //   }

    //   console.log("poids final with", poidsFinal, updatedValues);
    //   return updatedValues;
    // });
    console.log("Poids Final", poidsFinal);
  };
  const isButtonDisabled = Object.values(inputValues).some(
    (value) => value > max || value < 0
  );

  const handleLock = (titre) => {
    setIsLockedStates((prevValues) => ({
      ...prevValues,
      [titre]: !prevValues[titre],
    }));
  };

  const update = () => {
    setNewRows((prevData) =>
      prevData.map((item) => {
        const { titre } = item;
        const updatedPoids = poidsFinal[titre];

        if (updatedPoids !== undefined) {
          return {
            ...item,
            [field]: updatedPoids,
          };
        }

        return item;
      })
    );
    reset();
  };
  // useEffect(() => {
  //   if (isMax) {
  //     console.log("Its is max", poidsFinal, inputValues, isModifiedStates);
  //     Object.keys(poidsFinal).map((item) => {
  //       if (isModifiedStates[item] && isMax && isMaxTitre !== item) {
  //         setInputValues((prevValues) => ({
  //           ...prevValues,
  //           [item]: poidsFinal[titre],
  //         }));
  //       }
  //     });
  //   }
  // }, [isMax]);

  return (
    <Box
      sx={{
        maxHeight: "460px",
        overflowY: "auto",
      }}
    >
      <Box>
        <Typography variant="h6" mb={3}>
          Modifier poids
        </Typography>
      </Box>
      <Divider />
      <Box className="flex flex-col items-center gap-3 pt-[19px]">
        <Box className="flex flex-col gap-3 mb-3">
          <Typography>
            Poids Secteur <strong>({SECTEUR_ACTIVITE})</strong> :
            <span>
              <Typography
                variant="span"
                sx={{
                  fontWeight: "bold",
                  color: validPoidsFinal
                    ? "var(--success-color)"
                    : "var(--error-color)",
                }}
              >
                {sumPoidsFinal}
              </Typography>
              /<strong>{max}</strong>
            </span>
          </Typography>
          {sameSecteur.map((item) => {
            console.log(
              isMax && isMaxTitre !== item.titre,
              isMax,
              isMaxTitre,
              item.titre
            );
            return (
              <Box key={item.TICKER} className="flex item-center gap-[15px]">
                <Typography className="min-w-[150px]">{item.titre}</Typography>
                <Slider
                  aria-label={`${item.TICKER}-slider`}
                  // value={inputValues[item.titre]}
                  value={poidsFinal[item.titre]}
                  // value={poidsFinal[item.titre]}
                  onChange={(e) =>
                    handleInputChange(item.titre, e.target.value)
                  }
                  onChangeCommitted={() => handleLock(item.titre)}
                  valueLabelDisplay="on"
                  valueLabelFormat={() => poidsFinal[item.titre] + "%"}
                  className="min-w-[150px] max-w-[150px] mb-2"
                  disabled={
                    isLockedStates[item.titre] ||
                    (isMax && isMaxTitre !== item.titre)
                  }
                  step={0.1}
                  min={0}
                  max={maxSlider}
                />
                <TextField
                  id={`${item.titre}-poids`}
                  label="Poids (%)"
                  type="number"
                  disabled={
                    isLockedStates[item.titre] ||
                    (isMax && isMaxTitre !== item.titre)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    inputProps: {
                      max: maxSlider,
                      min: 0,
                    },
                  }}
                  variant="outlined"
                  onChange={(e) =>
                    handleInputChange(item.titre, e.target.value)
                  }
                  // value={inputValues[item.titre]}
                  //  isMax && isMaxTitre !== item.titre? 0:
                  value={poidsFinal[item.titre]}
                  className="min-w-[110px] max-w-[110px]"
                />
                {/* <span>
                  PF:{poidsFinal[item.titre]}-IV:{inputValues[item.titre]}
                </span> */}
                <IconButton onClick={() => handleLock(item.titre)}>
                  {isLockedStates[item.titre] ? (
                    <Lock size={18} color="var(--error-color)" />
                  ) : (
                    <Unlock size={18} color="var(--success-color)" />
                  )}
                </IconButton>
              </Box>
            );
          })}
        </Box>
        <Box className="self-end">
          <Button
            variant="contained"
            color="error"
            className="mx-[10px]"
            onClick={reset}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={update}
            // disabled={isButtonDisabled || !validPoidsFinal}
            disabled={isButtonDisabled}
          >
            Enregistrer
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default EditPoidsSecteurForm;
