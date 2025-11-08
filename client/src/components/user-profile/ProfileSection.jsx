import { useState, useContext, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { AppContext } from "../store/AppContext";
import SearchedListDialog from "./SearchedListDialog";
import PreferencesDialog from "./PreferencesDialog";
import NameChangerDialog from "./NameChangerDialog";
import EmailChangerDialog from "./EmailChangerDialog";
import DOBChangerDialog from "./DOBChangerDialog";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
function getFormattedDate(date) {
  const dt = new Date(date);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy}`;
}
function getFormattedDate2(date) {
  const [dd, mm, yyyy] = date.split("/");
  return `${yyyy}-${mm}-${dd}`;
}

const ProfileSection = ({ isLoading, onUpdateRequest, onDeleteRequest }) => {
  const { user, preferredThemes, searchList } = useContext(AppContext);
  const [show, setShow] = useState("");
  const [username, setUserName] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [dob, setDOB] = useState(user?.dob ?? "");
  const [age, setAge] = useState(user?.age ?? "");
  const [bday, setBday] = useState("");
  const [preview, setPreview] = useState(user?.picture ?? null);
  const [file, setFile] = useState(null);
  const [existingUserMsg, setExistingUserMsg] = useState("");

  async function setUserNameHandler(u_name) {
    try {
      const res = await fetch(`${BASE_URL}/users/check/r1/${u_name}`);
      const result = await res.json();
      if (result.exists) {
        setExistingUserMsg("User with this name already exists!");
        return;
      } else {
        setUserName(u_name);
        setExistingUserMsg("");
        setShow("");
      }
    } catch (err) {
      toast.error(
        <p className="font-medium text-[12px] text-red-50">
          Failed to change name! Please try later.
        </p>
      );
      console.error("Something went wrong!");
      setShow("");
    }
  }
  async function setEmailHandler(newEmail) {
    try {
      const res = await fetch(`${BASE_URL}/users/check/r2/${newEmail}`);
      const result = await res.json();
      if (result.exists) {
        setExistingUserMsg("User with this mailID already exists!");
        return;
      } else {
        setEmail(newEmail);
        setExistingUserMsg("");
        setShow("");
      }
    } catch (err) {
      toast.error(
        <p className="font-medium text-[12px] text-red-50">
          Failed to change email! Please try later.
        </p>
      );
      console.error("Something went wrong!");
      setShow("");
    }
  }
  async function setBDayHandler(bdayData) {
    const { bday, age } = bdayData;
    setBday(bday);
    const dt = getFormattedDate(bday);
    setDOB(dt);
    setAge(age);
    setShow("");
    // console.log(`DOB: ${bday}, age: ${age}`);
  }
  function handleFileChooser(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(selected.type)) {
      toast.warning(
        <div className="w-full flex flex-col px-1.5">
          <h3 className="font-bold text-amber-100 text-[16px]">
            Invalid image type!
          </h3>
          <p className="text-xs text-amber-500 font-medium">
            Please choose a proper image of either of image formats ('.jpg',
            '.png', '.jpeg') only.
          </p>
        </div>
      );
      return;
    }
    // set temporary image path
    const reader = new FileReader();
    reader.onload = (evt) => setPreview(evt.target.result);
    reader.readAsDataURL(selected);
    setFile(selected);
  }
  function handleUserData() {
    const userData = {
      username,
      email,
      dob: bday ? bday : getFormattedDate2(dob),
      age,
    };
    // console.log(userData);
    onUpdateRequest({ userData, file });
  }

  return (
    <>
      <section className="w-full min-h-screen relative bg-gray-900 flex lg:flex-row flex-col z-1 overflow-hidden">
        <div className="absolute top-5 -left-5 w-[360px] h-[700px] bg-[url('/images/icon-group-1.png')] bg-cover bg-center opacity-10 float-animate" />
        <div className="relative w-[70%] lg:[p-100px] p-[70px] mb-24">
          <h1 className="text-6xl font-extrabold text-white">
            Your <span className="text-indigo-500">Profile</span>
          </h1>
          <div className="grid lg:grid-cols-2 grid-cols-1 mt-6 mx-1.5">
            <div className="w-full h-full flex flex-col justify-between px-6 pt-7">
              <div className="w-full flex flex-col">
                <div
                  className="w-full flex items-center mt-3 pt-3"
                  data-aos="fade-right"
                  data-aos-delay="100"
                >
                  <strong className="text-gray-500 text-lg font-bold mr-3.5">
                    Username:
                  </strong>
                  <div className="flex items-center gap-1 group">
                    <span className="text-xl text-gray-200 bg-gray-950 tracking-wide py-1 px-2.5 rounded-md">
                      {username}
                    </span>
                    <i
                      className="fa-solid fa-pencil text-purple-600 group-hover:text-purple-400 text-xs cursor-pointer"
                      onClick={() => setShow("namechanger")}
                    />
                  </div>
                </div>
                <div
                  className="w-full flex items-center mt-3 pt-3"
                  data-aos="fade-right"
                  data-aos-delay="200"
                >
                  <strong className="text-gray-500 text-lg font-bold mr-3.5">
                    Email:
                  </strong>
                  <div className="flex items-center gap-1 group">
                    <span className="text-xl text-gray-200 bg-gray-950 tracking-wide py-1 px-2.5 rounded-md">
                      {email}
                    </span>
                    <i
                      className="fa-solid fa-pencil text-purple-600 group-hover:text-purple-400 text-xs cursor-pointer"
                      onClick={() => setShow("mailchanger")}
                    />
                  </div>
                </div>
                <div
                  className="w-full flex items-center mt-3 pt-3"
                  data-aos="fade-right"
                  data-aos-delay="300"
                >
                  <strong className="text-gray-500 text-lg font-bold mr-3.5">
                    DOB:
                  </strong>
                  <div className="flex items-center gap-1 group">
                    <span className="text-xl text-gray-200 bg-gray-950 tracking-wide py-1 px-2.5 rounded-md">
                      {dob}
                    </span>
                    <i
                      className="fa-solid fa-pencil text-purple-600 group-hover:text-purple-400 text-xs cursor-pointer"
                      onClick={() => setShow("dobchanger")}
                    />
                  </div>
                </div>
                <div
                  className="w-full flex items-center mt-3 pt-3"
                  data-aos="fade-right"
                  data-aos-delay="400"
                >
                  <strong className="text-gray-500 text-lg font-bold mr-3.5">
                    Age:
                  </strong>
                  <div className="flex items-center gap-1 group">
                    <span className="text-xl text-gray-200 bg-gray-950 tracking-wide py-1 px-2.5 rounded-md">
                      {age} yrs
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full relative flex items-center mb-4">
                <button
                  type="button"
                  className="w-[180px] disabled:w-[150px] btn z-2 flex items-center justify-center disabled:select-none disabled:pointer-events-none group"
                  disabled={isLoading}
                  onClick={handleUserData}
                >
                  {isLoading ? (
                    <>
                      <strong className="text-sm text-gray-950 group-hover:text-gray-300 tracking-wide transition duration-300">
                        Updating...
                      </strong>
                      <span className="block w-4 h-4 border-t-3 border-r-3 border-amber-200 ml-2 rounded-full animate-spin" />
                    </>
                  ) : (
                    <strong className="text-sm text-gray-950 group-hover:text-gray-300 tracking-wide transition duration-300">
                      Save Changes
                    </strong>
                  )}
                </button>
              </div>
            </div>
            <div className="w-full px-6 flex flex-col">
              <div
                className="py-4 pr-6"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <h3 className="text-[26px] text-gray-500 font-bold ml-1.5 tracking-wide">
                  Recent Searches
                </h3>
                <div className="card relative w-full h-[210px] bg-gray-700 rounded-3xl mt-2 overflow-clip">
                  <ul className="py-3 px-8 list-disc">
                    {searchList.map((val, i) => (
                      <li key={i} className="py-1 font-medium text-indigo-200">
                        {val}
                      </li>
                    ))}
                  </ul>
                  {searchList.length > 5 && (
                    <div
                      className="absolute bottom-0 left-0 w-full h-[150px] bg-blend-screen flex items-end justify-end px-6 z-2"
                      style={{
                        background:
                          "linear-gradient(to top, #030712, transparent)",
                      }}
                    >
                      <div
                        className="relative w-20 h-8 rounded-4xl flex items-center justify-center hover:bg-indigo-950 mb-2 -mr-4 goup transition duration-300 cursor-default"
                        onClick={() => setShow("searches")}
                      >
                        <strong className="text-indigo-600 group-hover:text-indigo-300 text-sm">
                          See All
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="py-4 pr-6"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <h3 className="text-[26px] text-gray-500 font-bold ml-1.5 tracking-wide">
                  Preferences
                </h3>
                <div className="card relative w-full h-[210px] bg-gray-700 rounded-3xl mt-2 overflow-clip">
                  <ul className="py-3 px-8 list-disc">
                    {preferredThemes.map((val, i) => (
                      <li key={i} className="py-1 font-medium text-indigo-200">
                        {val}
                      </li>
                    ))}
                  </ul>
                  {preferredThemes.length > 5 && (
                    <div
                      className="absolute bottom-0 left-0 w-full h-[150px] bg-blend-screen flex items-end justify-end px-6 z-2"
                      style={{
                        background:
                          "linear-gradient(to top, #030712, transparent)",
                      }}
                    >
                      <div
                        className="relative w-20 h-8 rounded-4xl flex items-center justify-center hover:bg-indigo-950 mb-2 -mr-4 goup transition duration-300 cursor-default"
                        onClick={() => setShow("preferences")}
                      >
                        <strong className="text-indigo-600 group-hover:text-indigo-300 text-sm">
                          See All
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <hr className="h-0.5 w-full bg-gray-600 mt-4 mb-18" />
          <div className="card bg-red-950 border-2 border-red-900 rounded-xl p-4 flex justify-between mb-12">
            <div className="flex flex-col justify-center px-3">
              <h4 className="font-bold text-3xl text-red-200">
                Remove your account
              </h4>
              <p className="text-sm font-medium text-red-400 leading-4.5 mt-2">
                Deleting your account erases all your current data and permenant
                loss to saved credentials. This action can't be undone.
              </p>
            </div>
            <div className="flex items-end justify-end px-3">
              <button
                type="button"
                className="w-[200px] h-10 bg-pink-800 hover:bg-pink-600 py-1 px-2 flex items-center justify-center rounded-lg cursor-pointer transition duration-300"
                onClick={onDeleteRequest}
              >
                <strong className="font-semibold text-red-50 tracking-wide">
                  Delete Account
                </strong>
              </button>
            </div>
          </div>
        </div>
        <div className="relative w-[30%] lg:py-[100px] p-[70px]">
          <div className="flex flex-col">
            <div className="relative w-full h-70" data-aos="fade-left">
              <div className="w-65 h-65 relative rounded-full ring-4 ring-offset-6 ring-offset-gray-900 ring-gray-500 overflow-clip">
                {user.picture ? (
                  <img
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    src={preview}
                    alt=""
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/avatar_default.png')] bg-cover bg-center">
                    <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] backdrop-blur-md flex flex-col items-center justify-center">
                      <h3 className="text-2xl font-bold text-gray-50">
                        No Profile Image
                      </h3>
                      <p className="text-xs font-medium text-indigo-300 px-2 text-center mt-1.5 leading-3">
                        No profile image available. Choose to set one
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute bottom-5 right-20 w-10 h-10 bg-purple-700 hover:bg-purple-500 transition-colors duration-300 rounded-full flex items-center justify-center p-1 cursor-pointer">
                <label htmlFor="image-chooser">
                  <i className="fa-solid fa-pencil text-gray-300" />
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="image-chooser"
                  onChange={handleFileChooser}
                  hidden
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {show === "searches" && (
          <SearchedListDialog onClose={() => setShow("")} />
        )}
        {show === "preferences" && (
          <PreferencesDialog onClose={() => setShow("")} />
        )}
        {show === "namechanger" && (
          <NameChangerDialog
            onClose={() => setShow("")}
            onDone={setUserNameHandler}
            existingUserMsg={existingUserMsg}
            value={username || ""}
          />
        )}
        {show === "mailchanger" && (
          <EmailChangerDialog
            onClose={() => setShow("")}
            onDone={setEmailHandler}
            existingUserMsg={existingUserMsg}
            value={email || ""}
          />
        )}
        {show === "dobchanger" && (
          <DOBChangerDialog
            onClose={() => setShow("")}
            onDone={setBDayHandler}
            value={dob || ""}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileSection;
