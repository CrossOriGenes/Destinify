import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Backdrop = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 right-0 w-full h-screen bg-transparent z-9"
      onClick={onClose}
    />
  );
};

const Menu = ({ onClose }) => {
  const navigate = useNavigate();
  const container = {
    hidden: { opacity: 0, y: -30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.5,
      },
    },
  };
  const list = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  return (
    <>
      <Backdrop onClose={onClose} />
      <motion.div
        variants={container}
        role="menu"
        aria-orientation="vertical"
        initial="hidden"
        animate="show"
        exit="hidden"
        className="absolute top-14 right-0 w-[250px] h-[202px] bg-amber-50 rounded-lg shadow-xl z-10"
      >
        <div className="absolute -top-1.5 right-14 w-3 h-3 bg-amber-50 rotate-45" />
        <div className="relative py-3 px-1">
          <div className="flex items-center justify-around mt-1">
            <img
              src="/images/user2.jpg"
              alt=""
              className="w-15 h-15 bg-cover bg-center rounded-full"
            />
            <div className="flex flex-col -ml-8">
              <h4 className="text-lg font-extrabold text-wrap">
                Snehodipto Das
              </h4>
              <p className="font-medium text-xs text-gray-500">abc@gmail.com</p>
            </div>
          </div>
          <hr className="w-full text-gray-300 mt-3 -mb-1" />
          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="list-none flex flex-col mt-2 px-1"
          >
            <motion.li
              variants={list}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="inline-flex items-center py-1.5 w-full hover:bg-gray-400 rounded-sm cursor-default"
              onClick={() => {
                navigate("profile");
                onClose();
              }}
            >
              <i className="fa-solid fa-user mx-1 text-[16px]" />
              <span className="font-semibold text-[15px] ml-1">Manage Profile</span>
            </motion.li>
            <motion.li
              variants={list}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="inline-flex items-center py-1.5 w-full hover:bg-gray-400 rounded-sm cursor-default"
              onClick={() => {
                navigate("../settings");
                onClose();
              }}
            >
              <i className="fa-solid fa-gear mx-1 text-[16px]" />
              <span className="font-semibold text-[15px] ml-1">Settings</span>
            </motion.li>
            <motion.li
              variants={list}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="inline-flex items-center py-1.5 w-full hover:bg-gray-400 rounded-sm cursor-default text-red-800"
              onClick={onClose}
            >
              <i className="fa-solid fa-arrow-right-from-bracket mx-1 text-[16px]" />
              <span className="font-semibold text-[15px] ml-1">Log out</span>
            </motion.li>
          </motion.ul>
        </div>
      </motion.div>
    </>
  );
};

export default Menu;
