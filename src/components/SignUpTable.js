import React, { useState, useEffect } from "react";
import axios from "axios";
import QrReader from "react-qr-reader";
import { toast } from "react-toastify";
import { reduxForm } from "redux-form";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MaUTable from "@mui/material/Table";
import { Formik } from "formik";
import PropTypes from "prop-types";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Select, MenuItem } from "@mui/material";
import TableToolbar from "./TableToolbar";
import TablePaginationActions from "./TablePaginationActions";
import { governorate } from "../data/governorates";
import { gender } from "../data/gender";
import { organizations } from "../data/organisation";
import { age } from "../data/age";
import { workshops } from "../data/workshops";
import TextInput from "./TextInput";
import * as Yup from "yup";
import Button from "@material-tailwind/react/Button";
import "react-toastify/dist/ReactToastify.css";
import "@material-tailwind/react/tailwind.css";
import { fetchAPI } from "../lib/api";

import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

const inputStyle = {
  padding: 0,
  margin: 0,
  border: 0,
  background: "transparent",
};
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const SignatureCanvasStyles = {
  border: "1px solid #000",
  boxShadow: 12,
  paddingTop: "15px",
  paddingBottom: "15px",
};
// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div style={inputStyle} onBlur={onBlur}>
      {value}
    </div>
  );
};

const validate = (values) => {
  const errors = {};
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "favoriteColor",
    "notes",
  ];
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });
  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = "Invalid email address";
  }
  return errors;
};

EditableCell.propTypes = {
  cell: PropTypes.shape({
    value: PropTypes.any.isRequired,
  }),
  row: PropTypes.shape({
    index: PropTypes.number.isRequired,
  }),
  column: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  updateMyData: PropTypes.func.isRequired,
};

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
};

const SignUpTable = (
  {
    columns,
    data,
    setData,
    updateMyData,
    skipPageReset,
    activeEvent,
    initialState,
    eventUId,
  },
  props
) => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeEventId, setActiveEventId] = useState();
  const [listChoice, setListChoice] = useState("signups");
  useEffect(() => {
    if (activeEvent !== undefined) {
      listChoice === "signups"
        ? fetchAPI(`/signups?active_events.id=${activeEvent.id}`).then((data) =>
            setPeople(data)
          )
        : fetchAPI(`/attendees?active_events.id=${activeEvent.id}`).then(
            (data) => setPeople(data)
          );
      const unique = [...new Set(people)];
      setPeople(unique);
      setActiveEventId(activeEvent.id);
    }
  }, [loading, activeEvent, listChoice]);
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter },
  } = useTable(
    {
      columns,
      data: people,
      defaultColumn,
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      initialState,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
  };

  const removeByIndexs = (array, indexs) =>
    array.filter((_, i) => !indexs.includes(i));

  const deleteUserHandler = (event) => {
    const newData = removeByIndexs(
      data,
      Object.keys(selectedRowIds).map((x) => parseInt(x, 10))
    );
    setData(newData);
  };

  const addUserHandler = (user) => {
    const newData = data.concat([user]);
    setData(newData);
  };
  const [open, setOpen] = React.useState(false);
  const [qrModalOpen, setQrModalOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [surname, setSurname] = useState("");
  const [Gender, setGender] = useState("");
  const [Age, setAge] = useState("");
  const [attendeeId, setAttendeeId] = useState();
  const [Workshop, setWorkshop] = useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [organization, setOrganization] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [eventId, setEventId] = React.useState("");
  const [Governorate, setGovernorate] = useState("");
  const [checked, setChecked] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(
    organizations[0]
  );
  const [evax, setEvax] = useState("نعم");
  const [activity, setActivity] = useState("");
  const [finishModule, setFinishModule] = useState(true);
  const [expectations, setExpectations] = useState("N'a pas du tout dépassé");
  const [relevance, setRelevance] = useState("Très pertinent");
  const [satisfaction, setSatisfaction] = useState("Très bon");
  const [comments, setComments] = useState("");

  const handleOpen = (values) => {
    console.log("Get here", values);
    setAttendeeId(values[0]);
    setGender(values[1]);
    setName(values[2]);
    setSurname(values[3]);
    setAge(values[4]);
    setGovernorate(values[5]);
    setOrganization(values[6]);
    setTitle(values[7]);
    setEmail(values[8]);
    setPhone(values[9]);

    /* Setting the workshop variable to the value of the 10th element in the values array. */
    // setWorkshop(values[10]);
    setEventId(activeEvent.id);
    setOpen(true);
  };
  const handleOpenFromQrCode = (values) => {
    const jsonValues = JSON.parse(values);
    setName(jsonValues.Name);
    setSurname(jsonValues.Surname);
    setGender(jsonValues.Gender);
    setAge(jsonValues.Age);
    setEmail(jsonValues.email);
    setPhone(jsonValues.Phone);
    setOrganization(jsonValues.Organization);
    setGovernorate(jsonValues.Governorate);
    setTitle(jsonValues.Title);
    setEvax(jsonValues.Vaccinated);
    setEventId(activeEvent.id);
    setWorkshop(jsonValues.Workshop);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setChecked(false);
  };
  const handleQrModalOpen = () => setQrModalOpen(true);
  const handleQrModalClose = () => setQrModalOpen(false);

  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  let sigPad = {};
  const clear = () => {
    sigPad.clear();
  };
  const trim = () => {
    setTrimmedDataURL(sigPad.getTrimmedCanvas().toDataURL("image/png"));
  };
  const handleScan = (data) => {
    if (data) {
      handleOpenFromQrCode(data);
      handleQrModalClose();
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  const MoveToSignup = async (e) => {
    const formData = new FormData();
    formData.append(
      "data",
      `{"Name":"${name}", "Surname":"${surname}", "Gender":"${Gender}", "Age":"${Age}","Governorate":"${Governorate}", "email":"${email}", "Title":"${title}", "Organization":"${
        selectedOrganization !== "Autre" ? selectedOrganization : organization
      }", "Phone":"${phone}", 
         "active_events":${JSON.stringify([{ id: eventUId }])}}`
    );
    const data = {
      email: e.email,
      Name: e.name,
      Surname: e.surname,
      Gender,
      Age,
      Organization:
        selectedOrganization !== "Autre" ? selectedOrganization : organization,
      Title: title,
      Phone: phone,
      Governorate,
      active_events: [JSON.stringify(eventUId)],
    };
    const jsonifiedData = JSON.stringify(data);
    axios
      .all([
        axios.post(
          `https://vt-events-backoffice.visittunisiaproject.org/signups`,
          jsonifiedData,
          {
            headers: { "Content-Type": "application/json" },
          }
        ),
        axios.delete(
          `https://vt-events-backoffice.visittunisiaproject.org/attendees/${e.attendeeId}`,

          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        ),
      ])
      .then(
        axios.spread((data1, data2) => {
          toast.success("You have successfully been moved to signups page");
          handleClose();
          window.location.reload(true);
        })
      );
  };

  const handleSubmit = async (e) => {
    const formData = new FormData();
    formData.append(
      "data",
      `{"Name":"${name}", "Surname":"${surname}", "Gender":"${Gender}", "Age":"${Age}","Governorate":"${Governorate}", "email":"${email}", "Title":"${title}", "Organization":"${
        selectedOrganization !== "Autre" ? selectedOrganization : organization
      }", "Phone":"${phone}", "activity":"${activity}",  "active_events":${JSON.stringify(
        [{ id: eventUId }]
      )}}`
    );
    listChoice !== "signups"
      ? axios
          .put(
            `https://vt-events-backoffice.visittunisiaproject.org/attendees/${e.attendeeId}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          )
          .then((res) => {
            handleClose();
            toast.success("You have successfully updated an attendee");
            setLoading(!loading);
          })
          .catch((err) => {
            console.log("err", err?.response?.data?.message);
            if (
              err.response.data.message === "An internal server error occurred"
            ) {
              toast.error(
                "An error has occurred. You might have been already registered. Please try again later"
              );
            }
            handleClose();
          })
      : axios
          .all([
            axios.post(
              `https://vt-events-backoffice.visittunisiaproject.org/attendees`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            ),
            axios.delete(
              `https://vt-events-backoffice.visittunisiaproject.org/signups/${e.attendeeId}`
            ),
          ])
          .then(
            axios.spread((data1, data2) => {
              console.log("data1", data1, "data2", data2);
              handleClose();
              window.location.reload(true);
            })
          );
  };
  // Render the UI for your table

  return (
    <div>
      {/* <Button onClick={handleQrModalOpen}>Scannez le code QR</Button> */}
      <Modal
        open={qrModalOpen}
        onClose={handleQrModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "100%" }}
          />
        </Box>
      </Modal>
      <TableContainer>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <div>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              // label="Age"
              value={listChoice}
            >
              <MenuItem
                value={"signups"}
                onClick={() => setListChoice("signups")}
              >
                Signups
              </MenuItem>
              <MenuItem
                value={"attendance"}
                onClick={() => setListChoice("attendance")}
              >
                Attendance
              </MenuItem>
            </Select>
          </div>
        </div>
        <TableToolbar
          deleteUserHandler={deleteUserHandler}
          addUserHandler={addUserHandler}
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={globalFilter}
          activeEvent={activeEvent}
          setLoading={setLoading}
          loading={loading}
        />
        <MaUTable {...getTableProps()}>
          <TableHead style={{ backgroundColor: "#E5E5E5", textAlign: "right" }}>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...(column.id === "selection"
                      ? column.getHeaderProps()
                      : column.getHeaderProps(column.getSortByToggleProps()))}
                    style={{ textAlign: "left", verticalAlign: "middle" }}
                  >
                    {column.render("Header")}
                    {column.id !== "selection" ? (
                      <TableSortLabel
                        active={column.isSorted}
                        // react-table has a unsorted state which is not treated here
                        direction={column.isSortedDesc ? "desc" : "asc"}
                      />
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell
                        style={{
                          cursor: "pointer",
                          textAlign: "left",
                          verticalAlign: "middle",
                        }}
                        onClick={() =>
                          handleOpen(row.cells.map((el) => el.value))
                        }
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePaginationActions
                rowsPerPageOptions={[
                  5,
                  10,
                  25,
                  { label: "All", value: people.length },
                ]}
                colSpan={3}
                count={people.length}
                rowsPerPage={pageSize}
                page={pageIndex}
                SelectProps={{
                  inputProps: { "aria-label": "lignes par page" },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </MaUTable>
      </TableContainer>
      {open && (
        <div
          class="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <span
              class="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <button
                    onClick={() => handleClose()}
                    class="absolute z-15 -top-2 -right-3 text-2xl w-10 h-10 rounded-full focus:outline-none text-black"
                  >
                    <svg
                      class="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                  <Formik
                    initialValues={{
                      email: email,
                      name: name,
                      surname: surname,
                      gender: Gender,
                      age: Age,
                      organization,
                      title,
                      phone,
                      governorate: Governorate,
                      evax,
                      comments,
                      activity,
                      attendeeId,
                    }}
                    validationSchema={Yup.object().shape({
                      email: Yup.string()
                        .email("Email is invalid")
                        .required("Email is required"),
                      name: Yup.string().required(),
                      surname: Yup.string().required(),
                      phone: Yup.string().required(),
                      // title: Yup.string().required(),
                    })}
                    onSubmit={(values) => handleSubmit(values)}
                  >
                    {({
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                      values,
                    }) => (
                      <div
                        class="flex flex-row-reverse"
                        style={{ maxWidth: "100%" }}
                      >
                        <div class="flex">
                          <form class="w-full max-w-lg" onSubmit={handleSubmit}>
                            <div class="flex flex-wrap -mx-3 mb-6">
                              <div class="w-full px-3">
                                <label
                                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
                                  for="grid-age"
                                >
                                  Genres
                                </label>
                                <select
                                  defaultValue={Gender}
                                  onChange={(e) => setGender(e.target.value)}
                                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-age"
                                >
                                  <option disabled selected value>
                                    {" "}
                                    Selectionner{" "}
                                  </option>
                                  {["Mr", "Mrs"].map((gender) => (
                                    <option value={gender}>{gender}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div class="flex -mx-3 mb-6">
                              <div class="w-full md:w-1/2 px-3">
                                <label
                                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                                  for="grid-surname"
                                >
                                  Nom
                                </label>
                                <TextInput
                                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  type="text"
                                  name="surname"
                                  onChange={(e) => setSurname(e.target.value)}
                                  onBlur={handleBlur}
                                  value={surname}
                                  error={
                                    errors.surname &&
                                    touched.surname &&
                                    errors.surname
                                  }
                                />
                              </div>
                              <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                                  for="grid-name"
                                >
                                  Prènom
                                </label>
                                <TextInput
                                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  type="text"
                                  name="name"
                                  onChange={(e) => setName(e.target.value)}
                                  onBlur={handleBlur}
                                  value={name}
                                  error={
                                    errors.name && touched.name && errors.name
                                  }
                                />
                              </div>
                            </div>

                            <div class="flex flex-wrap -mx-3 mb-6">
                              <div class="w-full px-3">
                                <label
                                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                                  for="grid-age"
                                >
                                  Age
                                </label>
                                <select
                                  onChange={(e) => setAge(e.target.value)}
                                  value={Age}
                                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-age"
                                >
                                  {age.map((ageBracket) => (
                                    <option value={ageBracket}>
                                      {ageBracket}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div class="flex flex-wrap -mx-3 mb-6">
                              {selectedOrganization !== "Autre" ? (
                                <div class="w-full px-3">
                                  <label
                                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                                    for="grid-organization"
                                  >
                                    Associations
                                  </label>
                                  <select
                                    onChange={(e) =>
                                      setSelectedOrganization(e.target.value)
                                    }
                                    class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-organization"
                                    type="text"
                                    placeholder="Organization"
                                    defaultValue={organization}
                                  >
                                    {organizations.sort().map((org) => (
                                      <option value={org}>{org}</option>
                                    ))}
                                  </select>
                                </div>
                              ) : (
                                <div class="w-full px-3">
                                  <label
                                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                                    for="grid-organization"
                                  >
                                    Association
                                  </label>
                                  <input
                                    autoFocus
                                    onChange={(e) =>
                                      setOrganization(e.target.value)
                                    }
                                    class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-organization"
                                    type="text"
                                  />
                                </div>
                              )}
                            </div>

                            <div class="flex flex-wrap -mx-3 mb-6">
                              <div class="w-full px-3">
                                <label
                                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                                  for="grid-city"
                                >
                                  Profession
                                </label>
                                <TextInput
                                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  type="text"
                                  name="title"
                                  onChange={(e) => setTitle(e.target.value)}
                                  onBlur={handleBlur}
                                  value={title}
                                  error={
                                    errors.title &&
                                    touched.title &&
                                    errors.title
                                  }
                                />
                              </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                              <div class="w-full px-3">
                                <label
                                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                                  for="grid-governorate"
                                >
                                  gouvernorat
                                </label>
                                <select
                                  onChange={(e) =>
                                    setGovernorate(e.target.value)
                                  }
                                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-governorate"
                                  value={Governorate}
                                >
                                  {governorate.map((gov) => (
                                    <option value={gov}>{gov}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div class="flex flex-wrap -mx-3 mb-6">
                              <div class="w-full px-3">
                                <label
                                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                                  for="grid-phone"
                                >
                                  Numéro Télephone
                                </label>
                                <TextInput
                                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  type="text"
                                  name="phone"
                                  onChange={(e) => setPhone(e.target.value)}
                                  onBlur={handleBlur}
                                  value={phone}
                                  error={
                                    errors.phone &&
                                    touched.phone &&
                                    errors.phone
                                  }
                                />
                              </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                              <div class="w-full px-3">
                                <label
                                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                                  for="grid-email"
                                >
                                  Email
                                </label>
                                <TextInput
                                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  type="email"
                                  name="email"
                                  onChange={(e) => setEmail(e.target.value)}
                                  onBlur={handleBlur}
                                  value={email}
                                  error={
                                    errors.email &&
                                    touched.email &&
                                    errors.email
                                  }
                                />
                              </div>
                            </div>

                            {/* <div class="flex flex-wrap -mx-3 mb-6">
                              <div class="w-full px-3">
                                <label
                                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                                  for="grid-governorate"
                                >
                                  Confirmer la fin du module
                                </label>
                                <select
                                  onChange={(e) =>
                                    setFinishModule(e.target.value)
                                  }
                                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-governorate"
                                  value={finishModule}
                                >
                                  {[
                                    { title: "Oui", value: true },
                                    { title: "Non", value: false },
                                  ].map((gov) => (
                                    <option value={gov.value}>
                                      {gov.title}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                              <div class="w-full px-3">
                                <label
                                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                                  for="grid-governorate"
                                >
                                  La formation a-t-elle répondu à vos attentes
                                  ou les a-t-elle dépassées ?
                                </label>
                                <select
                                  onChange={(e) =>
                                    setExpectations(e.target.value)
                                  }
                                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-governorate"
                                  value={expectations}
                                >
                                  {[
                                    "N'a pas du tout dépassé",
                                    "N'a pas dépassé",
                                    "Neutre",
                                    "A dépassé",
                                    "A beaucoup dépassé",
                                  ].map((gov) => (
                                    <option value={gov}>{gov}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                              <div class="w-full px-3">
                                <label
                                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                                  for="grid-relevance"
                                >
                                  Comment évaluez-vous la pertinence des thèmes
                                  abordés par rapport à votre emploi actuel ?
                                </label>
                                <select
                                  onChange={(e) => setRelevance(e.target.value)}
                                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-relevance"
                                  value={relevance}
                                >
                                  {[
                                    "Très pertinent",
                                    "pertinent",
                                    "neutre",
                                    "pas pertinent",
                                    "pas du tout pertinent",
                                  ].map((gov) => (
                                    <option value={gov}>{gov}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                              <div class="w-full px-3">
                                <label
                                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                                  for="grid-governorate"
                                >
                                  Comment évaluez-vous l'organisation et la
                                  structure générales de la formation et la
                                  compétence de l'animateur ?
                                </label>
                                <select
                                  onChange={(e) =>
                                    setSatisfaction(e.target.value)
                                  }
                                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-governorate"
                                  value={satisfaction}
                                >
                                  {[
                                    "Très bon",
                                    "bon",
                                    "neutre",
                                    "mauvais",
                                    "très mauvais",
                                  ].map((gov) => (
                                    <option value={gov}>{gov}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                              <div class="w-full px-3">
                                <label
                                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                                  for="grid-comments"
                                >
                                  Autres remarques ou suggestions
                                </label>
                                <TextInput
                                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  type="text"
                                  name="comments"
                                  onChange={(e) => setComments(e.target.value)}
                                  onBlur={handleBlur}
                                  value={comments}
                                  error={
                                    errors.comments &&
                                    touched.comments &&
                                    errors.comments
                                  }
                                />
                              </div>
                            </div> */}
                            <div class="flex mt-6">
                              <label class="flex items-start">
                                <input
                                  type="checkbox"
                                  class="form-checkbox h-8 w-8 mx-2"
                                  onClick={() => setChecked(!checked)}
                                />
                                <span class="mr-2 ">
                                  En m'inscrivant, je consens à l'utilisation de
                                  mes données personnelles À des fins liées au
                                  forum (communication, invitation à d'autres
                                  événements, sondages d'opinion...).
                                  <br /> Vos données personnelles sont traitées
                                  dans le respect des règles de transparence
                                  Honnêteté et respect des lois relatives à la
                                  protection des données personnelles
                                </span>
                              </label>
                            </div>
                            <div class="flex justify-between">
                              {listChoice !== "signups" && (
                                <div class="flex items-center justify-start mt-2">
                                  <Button
                                    type="button"
                                    onClick={() => MoveToSignup(values)}
                                    color={"red"}
                                    ripple="light"
                                  >
                                    Move back to Signups
                                  </Button>
                                </div>
                              )}
                              <div class="flex items-center justify-end mt-2">
                                <Button
                                  // onClick={() => handleSubmit()}
                                  type="submit"
                                  color={!checked ? "gray" : "lightBlue"}
                                  ripple="light"
                                >
                                  {listChoice !== "signups"
                                    ? "Update"
                                    : "Attendance"}
                                </Button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

SignUpTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  updateMyData: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  skipPageReset: PropTypes.bool.isRequired,
};
export default reduxForm({
  form: "MaterialUiForm", // a unique identifier for this form
  validate,
})(SignUpTable);
