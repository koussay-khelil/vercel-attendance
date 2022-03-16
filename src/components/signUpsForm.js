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
import TextInput from "./TextInput";
import "react-toastify/dist/ReactToastify.css";
import "@material-tailwind/react/tailwind.css";

toast.configure();

export default function SignupForm({ activeEvent, setLoading, loading }) {
  const [Gender, setGender] = useState(gender[0]);
  const [Age, setAge] = useState(age[0]);
  const [Organization, setOrganization] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState(
    organizations[0]
  );
  const [Governorate, setGovernorate] = useState(governorate[0]);
  const [evax, setEvax] = useState("نعم");
  const [checked, setChecked] = useState(false);

  const SignatureCanvasStyles = {
    border: "1px solid #000",
    boxShadow: 12,
    paddingTop: "15px",
    paddingBottom: "15px",
  };

  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  let sigPad = {};
  const clear = () => {
    sigPad.clear();
  };
  const trim = () => {
    setTrimmedDataURL(sigPad.getTrimmedCanvas().toDataURL("image/png"));
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
      `${e.name}-signature.png`
    );
    const formData = new FormData();
    formData.append("files.Signature", file, `${e.name}-signature.png`);
    formData.append(
      "data",
      `{"Name":"${e.name}", "Surname":"${
        e.surname
      }", "Gender":"${Gender}", "Age":"${Age}","Governorate":"${Governorate}", "email":"${
        e.email
      }", "Organization":"${
        selectedOrganization !== "Autre" ? selectedOrganization : Organization
      }", "Title":"${e.title}","Phone":"${
        e.phone
      }", "Vaccinated":"${evax}", "active_events":${JSON.stringify([
        { id: activeEvent.id },
      ])}}`
    );
    axios
      .post(`https://vt-events.herokuapp.com/attendees`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        toast.success("You have successfully been assigned as an attendee");
        setLoading(!loading);
      })
      .catch((err) => {
        console.log("err", err.response.data.message);
        if (err.response.data.message === "An internal server error occurred") {
          toast.error(
            "An error has occurred. You might have been already registered. Please try again later"
          );
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
        title: "",
        phone: "",
        governorate: Governorate,
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
      }) => (
        <div class="flex flex-row-reverse" style={{ maxWidth: "100%" }}>
          <Form class="w-full max-w-lg" onSubmit={handleSubmit}>
            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full px-3">
                <div class="mt-2 flex justify-end">
                  <div>
                    <label class="inline-flex items-center mr-2">
                      <span class="mr-2">{gender[1]}</span>
                      <input
                        checked={Gender === gender[1]}
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
                        checked={Gender === gender[0]}
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
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.surname && touched.surname && errors.surname}
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
                  onBlur={handleBlur}
                  error={errors.name && touched.name && errors.name}
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
                >
                  {age.map((ageBracket) => (
                    <option value={ageBracket}>{ageBracket}</option>
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
                    onChange={(e) => setSelectedOrganization(e.target.value)}
                    dir="rtl"
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
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-right"
                    for="grid-organization"
                  >
                    المؤسسة
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
            <div class="flex flex-wrap -mx-3 mb-6">
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
                  error={errors.title && touched.title && errors.title}
                />
              </div>
            </div>
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
                  error={errors.phone && touched.phone && errors.phone}
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
                  error={errors.email && touched.email && errors.email}
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
                >
                  <option value={"نعم"}>نعم</option>
                  <option value={"لا"}>لا</option>
                </select>
              </div>
            </div>
            <div class="flex mt-6">
              <label class="flex items-start">
                <span class="ml-2 text-right">
                  من خلال هذا التسجيل، أوافق على استعمال معطياتي الشخصية لأغراض
                  متعلقة بالمنتدى (الاتصال، دعوتكم لتظاهرات أخرى، استطلاعات
                  رأي...).
                  <br /> تتم معالجة معطياتكم الشخصية وفقا لقواعد الشفافية
                  والأمانة واحترام القوانين المتعلقة بحماية المعطيات الشخصية
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
                color={!checked || !trimmedDataURL ? "gray" : "lightBlue"}
                ripple="light"
                disabled={isSubmitting || !checked || !trimmedDataURL}
              >
                التسجيل
              </Button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
}
