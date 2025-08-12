import { Rating, RoundedStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

const starStyles = {
  itemShapes: RoundedStar,
  activeFillColor: "#ffb700",
  inactiveFillColor: "#666",
  //   inactiveFillColor: "transparent",
};

const RatingsStar = ({ value, style }) => {
  return (
    <Rating style={style} value={value} itemStyles={starStyles} readOnly />
  );
};

export default RatingsStar;
