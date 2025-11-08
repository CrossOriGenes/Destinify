import { useContext } from "react";
import Dialog from "../UI/Dialog";
import { AppContext } from "../store/AppContext";

const SearchedListDialog = ({ onClose }) => {
  const { searchList } = useContext(AppContext);
  
  return (
    <Dialog title="all searches" onClose={onClose}>
      <ul className="py-3 px-8 list-disc">
        {searchList.map((val, i) => (
          <li key={i} className="py-0.5 font-medium text-[14px] text-white">
            {val}
          </li>
        ))}
      </ul>
    </Dialog>
  );
};

export default SearchedListDialog;
