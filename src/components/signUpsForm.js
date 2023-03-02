import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import Button from "@material-tailwind/react/Button";
import * as Yup from "yup";
import { governorate } from "../data/governorates";
import { gender } from "../data/gender";
import { organizations } from "../data/organisation";
import { age } from "../data/age";
import { workshops } from "../data/workshops";
import { hotels } from "../data/hotels";
import { departments } from "../data/departments";
import TextInput from "./TextInput";
import "react-toastify/dist/ReactToastify.css";
import "@material-tailwind/react/tailwind.css";

toast.configure();

export default function SignupForm({
  activeEvent,
  setLoading,
  loading,
  handleClose,
}) {
  const [Gender, setGender] = useState(gender[0]);
  const [title, setTitle] = useState("");
  const [Age, setAge] = useState(age[0]);
  const [Workshop, setWorkshop] = useState(workshops[0]);
  const [Organization, setOrganization] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState(
    organizations[0]
  );
  const [Governorate, setGovernorate] = useState(governorate[0]);
  const [evax, setEvax] = useState("نعم");
  const [checked, setChecked] = useState(false);
  const [finishModule, setFinishModule] = useState(true);
  const [expectations, setExpectations] = useState("N'a pas du tout dépassé");
  const [relevance, setRelevance] = useState("Très pertinent");
  const [satisfaction, setSatisfaction] = useState("Très bon");
  const [comments, setComments] = useState("");
  const [Hotel, setHotel] = useState();
  const [selectedDepartment, setSelectedDepartment] = useState();

  const handleSubmit = async (e) => {
    const formData = new FormData();
    formData.append(
      "data",
      `{"Name":"${e.name}", "Surname":"${
        e.surname
      }", "Gender":"${Gender}", "Age":"${Age}","Governorate":"${Governorate}", "email":"${
        e.email
      }", "workshop":"${selectedDepartment}", "Organization":"${
        activeEvent?.event?.title ===
        "Tourism SME Training & Assistance Program"
          ? selectedOrganization === "Autre"
            ? Organization
            : selectedOrganization
          : Hotel
      }", "Title":"${title}","Phone":"${e.phone}","activity":"${
        e.activity
      }" ,"active_events":${JSON.stringify([activeEvent.id])}}`
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
        toast.success("You have successfully been assigned as an attendee");
        setLoading(!loading);
        handleClose();
      })
      .catch((err) => {
        console.log("err", err);
        if (err.response.data.message === "An internal server error occurred") {
          toast.error(
            "An error has occurred. You might have been already registered. Please try again later"
          );
          handleClose();
        }
      });
  };
  return (
    <Formik
      initialValues={{
        email: "",
        name: "",
        surname: "",
        gender: Gender,
        age: Age,
        organization:
          activeEvent?.event?.title ===
          "Tourism SME Training & Assistance Program"
            ? selectedOrganization
            : Hotel,
        title: title,
        phone: "",
        governorate: Governorate,
        activity: "",
        workshops: selectedDepartment,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Email is invalid")
          .required("Email is required"),
        name: Yup.string().required(),
        surname: Yup.string().required(),
        phone: Yup.string().required(),
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
      }) => (
        <div class="flex flex-row-reverse" style={{ maxWidth: "100%" }}>
          <Form class="w-full max-w-lg" onSubmit={handleSubmit}>
            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
                  for="grid-age"
                >
                  Genre
                </label>
                <select
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
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
                  for="grid-surname"
                >
                  Nom
                </label>
                <TextInput
                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="surname"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.surname && touched.surname && errors.surname}
                />
              </div>
              <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
                  for="grid-name"
                >
                  Prénom
                </label>
                <TextInput
                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.name && touched.name && errors.name}
                />
              </div>
            </div>

            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
                  for="grid-age"
                >
                  Tranche d'age
                </label>
                <select
                  onChange={(e) => setAge(e.target.value)}
                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-age"
                >
                  <option disabled selected value>
                    {" "}
                    Selectionner{" "}
                  </option>
                  {age.map((ageBracket) => (
                    <option value={ageBracket}>{ageBracket}</option>
                  ))}
                </select>
              </div>
            </div>

            <div class="flex flex-wrap -mx-3 mb-6">
              {selectedOrganization !== "Autre" ? (
                <div class="w-full px-3">
                  <label
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
                    for="grid-organization"
                  >
                    PME
                  </label>
                  <select
                    onChange={(e) => setSelectedOrganization(e.target.value)}
                    class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-organization"
                    type="text"
                    placeholder="Organization"
                  >
                    <option disabled selected value>
                      {" "}
                      Selectionner{" "}
                    </option>

                    {organizations.sort().map((org) => (
                      <option value={org}>{org}</option>
                    ))}
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              ) : (
                <div class="w-full px-3">
                  <label
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
                    for="grid-organization"
                  >
                    PME
                  </label>
                  <input
                    autoFocus
                    onChange={(e) =>
                      activeEvent?.event?.title ===
                      "Tourism SME Training & Assistance Program"
                        ? setOrganization(e.target.value)
                        : setHotel(e.target.value)
                    }
                    class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-organization"
                    type="text"
                    placeholder="Organization"
                  />
                </div>
              )}
            </div>
            {activeEvent?.event?.title !==
              "Tourism SME Training & Assistance Program" && (
              <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                  <label
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
                    for="grid-age"
                  >
                    Département
                  </label>
                  <select
                    defaultValue={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-age"
                  >
                    <option disabled selected value>
                      {" "}
                      Selectionner{" "}
                    </option>
                    {departments.map((department) => (
                      <option value={department}>{department}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
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
                  error={errors.title && touched.title && errors.title}
                />
              </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
                  for="grid-governorate"
                >
                  Lieu de résidence habituelle
                </label>
                <select
                  onChange={(e) => setGovernorate(e.target.value)}
                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-governorate"
                >
                  <option disabled selected value>
                    {" "}
                    Selectionner{" "}
                  </option>
                  {governorate.map((gov) => (
                    <option value={gov}>{gov}</option>
                  ))}
                </select>
              </div>
            </div>

            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
                  for="grid-phone"
                >
                  Numéro Télephone
                </label>
                <TextInput
                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="phone"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.phone && touched.phone && errors.phone}
                />
              </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
                  for="grid-email"
                >
                  Email
                </label>
                <TextInput
                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email && touched.email && errors.email}
                />
              </div>
            </div>

            <div class="flex mt-6">
              <label class="flex items-start">
                <input
                  type="checkbox"
                  class="form-checkbox mt-1 ml-2"
                  onClick={() => setChecked(!checked)}
                />
                <span class="ml-2 text-left">
                  En m'inscrivant, je consens à l'utilisation de mes données
                  personnelles À des fins liées au forum (communication,
                  invitation à d'autres événements, sondages d'opinion...).
                  <br /> Vos données personnelles sont traitées dans le respect
                  des règles de transparence Honnêteté et respect des lois
                  relatives à la protection des données personnelles
                </span>
              </label>
            </div>

            <div class="flex items-center justify-end mt-2">
              <Button
                type="submit"
                onClick={handleSubmit}
                color={!checked ? "gray" : "lightBlue"}
                ripple="light"
                disabled={isSubmitting || !checked}
              >
                Inscription
              </Button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
}
