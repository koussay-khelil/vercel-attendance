import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import Button from "@material-tailwind/react/Button";
import SignatureCanvas from "react-signature-canvas";
import Box from "@mui/material/Box";
import * as Yup from "yup";
import { governorate } from "../data/governorates";
import { gender } from "../data/gender";
import { organizations } from "../data/organisation";
import { age } from "../data/age";
import { workshops } from "../data/workshops";
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

  const handleSubmit = async (e) => {
    const formData = new FormData();
    console.log("e", e, comments);
    formData.append(
      "data",
      `{"Name":"${e.name}", "Surname":"${
        e.surname
      }", "Gender":"${Gender}", "Age":"${Age}","Governorate":"${Governorate}", "email":"${
        e.email
      }", "Organization":"${
        selectedOrganization !== "Autre" ? selectedOrganization : Organization
      }", "Title":"${title}","Phone":"${e.phone}","activity":"${
        e.activity
      }", "ModuleFinished":"${finishModule}", "expectations":"${expectations}", "relevance":"${relevance}", "satisfaction":"${satisfaction}" , "comments":"${comments}" ,"active_events":${JSON.stringify(
        [activeEvent.id]
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
          selectedOrganization !== "أخرى" ? selectedOrganization : Organization,
        title: title,
        phone: "",
        governorate: Governorate,
        activity: "",
        finishModule: finishModule,
        expectations: expectations,
        relevance: relevance,
        satisfaction: satisfaction,
        comments: comments,
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
                <div class="mt-2 flex justify-start">
                  <div>
                    <label class="inline-flex items-center">
                      <input
                        checked={Gender === gender[0]}
                        type="checkbox"
                        class="form-checkbox"
                        onClick={() => setGender(gender[0])}
                      />
                      <span class="mr-2">{gender[0]}</span>
                    </label>
                  </div>
                  <div>
                    <label class="inline-flex items-center mr-2">
                      <input
                        checked={Gender === gender[1]}
                        type="checkbox"
                        class="form-checkbox"
                        onClick={() => setGender(gender[1])}
                      />
                      <span class="mr-2">{gender[1]}</span>
                    </label>
                  </div>
                </div>
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
                  Prènom
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
                  Age
                </label>
                <select
                  onChange={(e) => setAge(e.target.value)}
                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-age"
                >
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
                    Institution
                  </label>
                  <select
                    onChange={(e) => setSelectedOrganization(e.target.value)}
                    class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-organization"
                    type="text"
                    placeholder="Organization"
                  >
                    {organizations.map((org) => (
                      <option value={org}>{org}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div class="w-full px-3">
                  <label
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
                    for="grid-organization"
                  >
                    Institution
                  </label>
                  <input
                    onChange={(e) => setOrganization(e.target.value)}
                    class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-organization"
                    type="text"
                    placeholder="Organization"
                  />
                </div>
              )}
            </div>
            {/* <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
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
                  error={errors.title && touched.title && errors.title}
                />
              </div>
            </div> */}
            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
                  for="grid-governorate"
                >
                  Gouvernorat
                </label>
                <select
                  onChange={(e) => setGovernorate(e.target.value)}
                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-governorate"
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
                  error={errors.title && touched.title && errors.title}
                />
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
            {/* <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
                  for="grid-workshop"
                >
                  ورشة عمل
                </label>
                <select
                  
                  onChange={(e) => setWorkshop(e.target.value)}
                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-workshop"
                >
                  {workshops.map((workshop) => (
                    <option value={workshop}>{workshop}</option>
                  ))}
                </select>
              </div>
            </div> */}
            {/* <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
                  for="grid-governorate"
                >
                  <span dir="ltr" lang="fr">
                    {" "}
                    ؟ EVAX
                  </span>
                  <span  lang="ar">
                    {" "}
                    من منظومة{" "}
                  </span>
                  <span dir="ltr" lang="fr">
                    {" "}
                    (Pass sanitaire){" "}
                  </span>

                  <span  lang="ar">
                    {" "}
                    هل قمتم بتحميل شهادة التلقيح ضد فيروس كورونا
                  </span>
                </label>
                <select
                  onChange={(e) => setEvax(e.target.value)}
                  
                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-governorate"
                >
                  <option value={"نعم"}>نعم</option>
                  <option value={"لا"}>لا</option>
                </select>
              </div>
            </div> */}
            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                  for="grid-governorate"
                >
                  Confirmer la fin du module
                </label>
                <select
                  onChange={(e) => setFinishModule(e.target.value)}
                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-governorate"
                  value={finishModule}
                >
                  {[
                    { title: "Oui", value: true },
                    { title: "Non", value: false },
                  ].map((gov) => (
                    <option value={gov.value}>{gov.title}</option>
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
                  La formation a-t-elle répondu à vos attentes ou les a-t-elle
                  dépassées ?
                </label>
                <select
                  onChange={(e) => setExpectations(e.target.value)}
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
                  Comment évaluez-vous la pertinence des thèmes abordés par
                  rapport à votre emploi actuel ?
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
                  Comment évaluez-vous l'organisation et la structure générales
                  de la formation et la compétence de l'animateur ?
                </label>
                <select
                  onChange={(e) => setSatisfaction(e.target.value)}
                  class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-governorate"
                  value={satisfaction}
                >
                  {["Très bon", "bon", "neutre", "mauvais", "très mauvais"].map(
                    (gov) => (
                      <option value={gov}>{gov}</option>
                    )
                  )}
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
                  value={comments}
                  error={errors.comments && touched.comments && errors.comments}
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
            {/* <Box sx={{ ...SignatureCanvasStyles }}>
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
            </Box> */}
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
