import { Rating, RoundedStar, Heart } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

const starStyles = {
  itemShapes: RoundedStar,
  activeFillColor: "#ffb700",
  inactiveFillColor: "#666",
};
const starStyles2 = {
  itemShapes: Heart,
  activeFillColor: "#f6339a",
  inactiveFillColor: "#fda5d5",
};

const RatingsStar = ({ value, style }) => {
  return (
    <Rating style={style} value={value} itemStyles={starStyles} readOnly />
  );
};

export const RatingHeart = ({ value, style }) => {
  return (
    <Rating style={style} value={value} itemStyles={starStyles2} readOnly />
  );
};

export default RatingsStar;
