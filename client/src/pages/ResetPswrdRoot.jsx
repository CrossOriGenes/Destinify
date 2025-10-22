import { Outlet } from "react-router-dom";

function ResetPswrdRoot() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute top-5 -right-35 w-[360px] h-[700px] bg-[url('/images/icon-group-1.png')] bg-cover bg-center opacity-10 float-animate z-1" />
      <div className="absolute bottom-9 left-9 w-[160px] h-[160px] rounded-b-full bg-[url('/images/dots.png')] bg-cover bg-center rotation-animate z-1" />
      <Outlet />
      <footer className="absolute bottom-0 left-0 w-full py-2 px-4 flex items-center justify-between">
        <p className="text-sm text-gray-300">
          &copy; Destinify | All rights reserved
        </p>
        <div className="flex items-center justify-between gap-4 text-gray-500 text-sm">
          <a
            href="../../policies"
            className="text-gray-400 hover:text-white font-medium cursor-pointer transition duration-300"
          >
            Policy
          </a>
          <a
            href="../../terms"
            className="text-gray-400 hover:text-white font-medium cursor-pointer transition duration-300"
          >
            Terms
          </a>
        </div>
      </footer>
    </main>
  );
}

export default ResetPswrdRoot;
