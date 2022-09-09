import React, { useState, useEffect } from "react";
import axios from "axios";
import QrReader from "react-qr-reader";
import { toast } from "react-toastify";
import { reduxForm } from "redux-form";
import SignatureCanvas from "react-signature-canvas";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MaUTable from "@mui/material/Table";
import { Formik, Form } from "formik";
import PropTypes from "prop-types";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
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
  },
  props
) => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (activeEvent !== undefined) {
      fetchAPI(`/Signups?active_events.id=1`).then((data) => setPeople(data));
      fetchAPI(`/attendees?active_events.id=1`).then((data) => setPeople(data));
      const unique = [...new Set(people)];
      setPeople(unique);
    }
  }, [loading, activeEvent]);
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

  const handleOpen = (values) => {
    setGender(values[0]);
    setName(values[1]);
    setSurname(values[2]);
    setAge(values[3]);
    setGovernorate(values[4]);
    setOrganization(values[5]);
    // setTitle(values[6]);
    setEmail(values[7]);
    setPhone(values[8]);
    setEvax(values[9]);
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

  const handleSubmit = async (e) => {
    const dataURLtoFile = (dataurl, filename) => {
      const arr = dataurl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n) {
        u8arr[n - 1] = bstr.charCodeAt(n - 1);
        n -= 1; // to make eslint happy
      }
      return new File([u8arr], filename, { type: mime });
    };
    const file = dataURLtoFile(
      sigPad.getTrimmedCanvas().toDataURL("image/png"),
      `${name}-signature.png`
    );
    const formData = new FormData();
    formData.append("files.Signature", file, `${name}-signature.png`);
    formData.append(
      "data",
      `{"Name":"${name}", "Surname":"${surname}", "Gender":"${Gender}", "Age":"${Age}","Governorate":"${Governorate}", "email":"${email}", "Organization":"${organization}", "Phone":"${phone}", "Vaccinated":"${evax}", "Active_events":${JSON.stringify(
        [{ id: activeEvent.id }]
      )}}`
    );
    axios
      .post(
        `https://vt-events-backoffice.visittunisiaproject.org/attendees`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((res) => {
        handleClose();
        toast.success("You have successfully been assigned as an attendee");
        setLoading(!loading);
      })
      .catch((err) => {
        console.log("err", err?.response?.data?.message);
        if (err.response.data.message === "An internal server error occurred") {
          toast.error(
            "An error has occurred. You might have been already registered. Please try again later"
          );
        }
        handleClose();
      });
  };
  // Render the UI for your table
  return (
    <div>
      <Button onClick={handleQrModalOpen}>Scannez le code QR</Button>
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
              <TablePagination
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
                      organization: organization,
                      title: title,
                      phone: phone,
                      governorate: Governorate,
                      evax: evax,
                    }}
                    validationSchema={Yup.object().shape({
                      email: Yup.string()
                        .email("Email is invalid")
                        .required("Email is required"),
                      name: Yup.string().required(),
                      surname: Yup.string().required(),
                      phone: Yup.string().required(),
                      title: Yup.string().required(),
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
                        {console.log(values)}
                        <Form class="w-full max-w-lg" onSubmit={handleSubmit}>
                          <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full px-3">
                              <div class="mt-2 flex justify-end">
                                <div>
                                  <label class="inline-flex items-center mr-2">
                                    <span class="mr-2">{gender[1]}</span>
                                    <input
                                      checked={values.gender === gender[1]}
                                      type="checkbox"
                                      class="form-checkbox"
                                      onClick={() => setGender(gender[1])}
                                    />
                                  </label>
                                </div>
                                <div>
                                  <label class="inline-flex items-center">
                                    <span class="mr-2">{gender[0]}</span>
                                    <input
                                      checked={values.gender === gender[0]}
                                      type="checkbox"
                                      class="form-checkbox"
                                      onClick={() => setGender(gender[0])}
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="flex -mx-3 mb-6">
                            <div class="w-full md:w-1/2 px-3">
                              <label
                                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-right"
                                for="grid-surname"
                              >
                                اللقب
                              </label>
                              <TextInput
                                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                type="text"
                                name="surname"
                                value={values.surname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  errors.surname &&
                                  touched.surname &&
                                  errors.surname
                                }
                              />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                              <label
                                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-right"
                                for="grid-name"
                              >
                                الإسم
                              </label>
                              <TextInput
                                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                type="text"
                                name="name"
                                onChange={handleChange}
                                value={values.name}
                                onBlur={handleBlur}
                                error={
                                  errors.name && touched.name && errors.name
                                }
                              />
                            </div>
                          </div>

                          <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full px-3">
                              <label
                                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-right"
                                for="grid-age"
                              >
                                الفئة العمرية
                              </label>
                              <select
                                dir="rtl"
                                onChange={(e) => setAge(e.target.value)}
                                class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-age"
                                defaultValue={values.age}
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
                            {selectedOrganization !== "أخرى" ? (
                              <div class="w-full px-3">
                                <label
                                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-right"
                                  for="grid-organization"
                                >
                                  المؤسسة
                                </label>
                                <select
                                  onChange={(e) =>
                                    setSelectedOrganization(e.target.value)
                                  }
                                  dir="rtl"
                                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-organization"
                                  type="text"
                                  placeholder="Organization"
                                  defaultValue={values.organization}
                                >
                                  {organizations.map((org) => (
                                    <option value={org}>{org}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <div class="w-full px-3">
                                <label
                                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-right"
                                  for="grid-organization"
                                >
                                  المؤسسة
                                </label>
                                <input
                                  onChange={(e) =>
                                    setOrganization(e.target.value)
                                  }
                                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-organization"
                                  type="text"
                                  placeholder="Organization"
                                  defaultValue={values.organization}
                                />
                              </div>
                            )}
                          </div>
                          {/* <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full px-3">
                              <label
                                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-right"
                                for="grid-city"
                              >
                                الوظيفة
                              </label>
                              <TextInput
                                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                type="text"
                                name="title"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  errors.title && touched.title && errors.title
                                }
                                value={values.title}
                              />
                            </div>
                          </div> */}
                          <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full px-3">
                              <label
                                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-right"
                                for="grid-governorate"
                              >
                                الولاية
                              </label>
                              <select
                                onChange={(e) => setGovernorate(e.target.value)}
                                dir="rtl"
                                class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-governorate"
                                defaultValue={values.governorate}
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
                                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-right"
                                for="grid-phone"
                              >
                                رقم الهاتف
                              </label>
                              <TextInput
                                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                type="text"
                                name="phone"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  errors.phone && touched.phone && errors.phone
                                }
                                value={values.phone}
                              />
                            </div>
                          </div>
                          <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full px-3">
                              <label
                                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-right"
                                for="grid-email"
                              >
                                البريد الإلكتروني
                              </label>
                              <TextInput
                                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                type="email"
                                name="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  errors.email && touched.email && errors.email
                                }
                                value={values.email}
                              />
                            </div>
                          </div>

                          <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full px-3">
                              <label
                                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-right"
                                for="grid-governorate"
                              >
                                <span dir="ltr" lang="fr">
                                  {" "}
                                  ؟ EVAX
                                </span>
                                <span dir="rtl" lang="ar">
                                  {" "}
                                  من منظومة{" "}
                                </span>
                                <span dir="ltr" lang="fr">
                                  {" "}
                                  (Pass sanitaire){" "}
                                </span>

                                <span dir="rtl" lang="ar">
                                  {" "}
                                  هل قمتم بتحميل شهادة التلقيح ضد فيروس كورونا
                                </span>
                              </label>
                              <select
                                onChange={(e) => setEvax(e.target.value)}
                                dir="rtl"
                                class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-governorate"
                                defaultValue={values.evax}
                              >
                                <option value={"نعم"}>نعم</option>
                                <option value={"لا"}>لا</option>
                              </select>
                            </div>
                          </div>
                          <div class="flex mt-6">
                            <label class="flex items-start">
                              <span class="ml-2 text-right">
                                من خلال هذا التسجيل، أوافق على استعمال معطياتي
                                الشخصية لأغراض متعلقة بالمنتدى (الاتصال، دعوتكم
                                لتظاهرات أخرى، استطلاعات رأي...).
                                <br /> تتم معالجة معطياتكم الشخصية وفقا لقواعد
                                الشفافية والأمانة واحترام القوانين المتعلقة
                                بحماية المعطيات الشخصية
                              </span>
                              <input
                                type="checkbox"
                                class="form-checkbox mt-1 ml-2"
                                onClick={() => setChecked(!checked)}
                              />
                            </label>
                          </div>
                          <Box sx={{ ...SignatureCanvasStyles }}>
                            <SignatureCanvas
                              penColor="black"
                              ref={(ref) => {
                                sigPad = ref;
                              }}
                              canvasProps={{
                                width: 500,
                                height: 200,
                                className: "sigCanvas",
                              }}
                            />
                            <div class="flex">
                              <Button
                                type="button"
                                onClick={trim}
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-4 rounded focus:outline-none focus:shadow-outline"
                              >
                                Sign
                              </Button>
                              <Button
                                type="button"
                                color="red"
                                class="ml-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                                onClick={clear}
                              >
                                Clear
                              </Button>
                            </div>
                            {trimmedDataURL ? (
                              <img src={trimmedDataURL} alt="signature" />
                            ) : null}
                          </Box>
                          <div class="flex items-center justify-end mt-2">
                            <Button
                              type="submit"
                              onClick={handleSubmit}
                              color={
                                !checked || !trimmedDataURL
                                  ? "gray"
                                  : "lightBlue"
                              }
                              ripple="light"
                              disabled={
                                isSubmitting || !checked || !trimmedDataURL
                              }
                            >
                              التسجيل
                            </Button>
                          </div>
                        </Form>
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
