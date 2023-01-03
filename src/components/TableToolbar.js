import React from "react";

import AddUserDialog from "./AddUserDialog";
import clsx from "clsx";
import DeleteIcon from "@mui/icons-material/Delete";
import GlobalFilter from "./GlobalFilter";
import IconButton from "@mui/material/IconButton";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: "0px !important",
    paddingRight: "0px !important",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "auto",
    },
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: theme.palette.secondary.light,
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
    fontSize: "15px !important",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  filter: {
    [theme.breakpoints.down("sm")]: {
      paddingTop: "25px",
      paddingBottom: "10px",
    },
  },
}));

const TableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    numSelected,
    addUserHandler,
    deleteUserHandler,
    preGlobalFilteredRows,
    setGlobalFilter,
    globalFilter,
    activeEvent,
    setLoading,
    loading,
  } = props;
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <AddUserDialog
        addUserHandler={addUserHandler}
        activeEvent={activeEvent}
        setLoading={setLoading}
        loading={loading}
      />
      <Typography className={classes.title} variant="h6" id="tableTitle">
        Nouveau participant
      </Typography>
      <GlobalFilter
        className={classes.filter}
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  addUserHandler: PropTypes.func.isRequired,
  deleteUserHandler: PropTypes.func.isRequired,
  setGlobalFilter: PropTypes.func.isRequired,
  preGlobalFilteredRows: PropTypes.array.isRequired,
  globalFilter: PropTypes.string.isRequired,
};

export default TableToolbar;
