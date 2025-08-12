import { useRef } from "react";

const Newsletter = ({ onSubmit }) => {
  const nameRef = useRef();
  const mailRef = useRef();
  const formRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    const subscriberData = {
      subscriber_name: nameRef.current.value,
      subscriber_mail: mailRef.current.value,
    };
    onSubmit(subscriberData);
    formRef.current.reset();
  }
  return (
    <div className="relative w-full min-h-[55vh]">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/city-bg.jpg')] bg-cover bg-center bg-no-repeat -z-1" />
      <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.8)]" />
      <div
        className="absolute bottom-0 left-0 w-full h-[100px] bg-blend-screen z-3"
        style={{ background: "linear-gradient(to top, #030712, transparent)" }}
      />
      <div className="flex xl:flex-row flex-col items-center justify-between p-[100px]">
        <div className="flex flex-col lg:w-[60%] w-full mx-3 z-1">
          <h1 className="font-extrabold capitalize text-7xl leading-17 text-white pb-3">
            Never miss&nbsp;
            <span className="text-indigo-500">an adventure</span>
          </h1>
          <p className="font-light text-gray-400 text-lg leading-6 my-3">
            Join our travel community to recieve special offers, package-updates
            and new tour suggestions.
          </p>
        </div>
        <div className="flex flex-col lg:w-[40%] lg:my-0 my-5 w-full ml-3 z-1">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="w-full relative py-3">
              <i className="fa-solid fa-user absolute top-7 left-4 text-xl text-gray-400" />
              <input
                type="text"
                ref={nameRef}
                id="user-name"
                placeholder="Name"
                className="px-12 py-3 border-2 border-gray-200 rounded-3xl w-full font-semibold text-white placeholder:text-gray-400 focus:outline-none transition duration-300"
                required
              />
            </div>
            <div className="w-full relative py-3">
              <i className="fa-solid fa-envelope absolute top-7 left-4 text-xl text-gray-400" />
              <input
                type="email"
                ref={mailRef}
                id="user-email"
                placeholder="Email"
                className="px-12 py-3 border-2 border-gray-200 rounded-3xl w-full font-semibold text-white placeholder:text-gray-400 focus:outline-none transition duration-300"
                required
              />
            </div>
            <div className="relative flex items-end justify-start mt-8">
              <button className="btn z-5">
                <span className="font-bold uppercase text-white">
                  Subscribe now
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
