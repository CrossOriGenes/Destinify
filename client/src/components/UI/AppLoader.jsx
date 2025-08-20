const AppLoader = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div id="loader">
        <span className="inline-block w-[20px] h-[20px] rounded-full my-[35px] mx-[5px] bg-[#ef5c72]"></span>
        <span className="inline-block w-[20px] h-[20px] rounded-full my-[35px] mx-[5px] bg-[#7054e6]"></span>
        <span className="inline-block w-[20px] h-[20px] rounded-full my-[35px] mx-[5px] bg-[#f89321]"></span>
      </div>
      <p className="text-4xl font-bold">Loading...</p>
    </div>
  );
};

export default AppLoader;