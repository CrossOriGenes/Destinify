const AppLoader = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div id="loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p className="text-4xl font-bold">Loading...</p>
    </div>
  );
};

export default AppLoader;