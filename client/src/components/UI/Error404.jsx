import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const Error404 = () => {
  const overlayRef = useRef();
  const [show, setShow] = useState(true);
  useEffect(() => {
    function handleMouseMove(e) {
      const overlay = overlayRef.current;
      const x = e.clientX;
      const y = e.clientY;
      const pos = `${x}px ${y}px`;
      overlay.style.maskImage = `radial-gradient(circle 150px at ${pos}, transparent 0%, black 150px)`;
      overlay.style.webkitMaskImage = overlay.style.maskImage;
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShow(!show);
    }, 5000);
  });

  return (
    <section className="relative w-screen h-screen bg-gray-900 text-white overflow-hidden">
      {show && (
        <div className="mx-12 my-6 relative w-full place-items-center z-3">
          <div className="card bg-[rgba(225, 225, 225, 0.5)] flex flex-col items-center justify-center h-13">
            <p className="p-4 text-gray-900 font-semibold">
              Hover on the page to see hidden text!
            </p>
          </div>
        </div>
      )}
      {/* Main content hidden by default, revealed by spotlight */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-1">
        <pre className="mb-6 float-animate">
          <code className="font-extrabold text-8xl !font-['Consolas',sans-serif] text-amber-300">
            ERROR 404!
          </code>
        </pre>
        <h1 className="text-6xl font-bold mb-4">Page Not Found!</h1>
        <p className="text-xl">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <motion.a
          href="../.."
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", damping: 15, stiffness: 900 }}
          className="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded font-bold text-lg tracking-wider"
        >
          Go Home
        </motion.a>
      </div>
      {/* Dark overlay with spotlight mask */}
      <div
        ref={overlayRef}
        id="overlay"
        className="absolute inset-0 bg-gray-950 z-2 select-none pointer-events-none"
      />
    </section>
  );
};

export default Error404;
