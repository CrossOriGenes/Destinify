import {
  Rating,
  RoundedStar,
  StickerStar,
  Heart,
} from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

const starStyles = {
  itemShapes: RoundedStar,
  activeFillColor: "#ffb700",
  inactiveFillColor: "#666",
};
const RatingsStar = ({ value, style }) => {
  return (
    <Rating style={style} value={value} itemStyles={starStyles} readOnly />
  );
};

const Star = (
  <path d="M62 25.154H39.082L32 3l-7.082 22.154H2l18.541 13.693L13.459 61L32 47.309L50.541 61l-7.082-22.152L62 25.154z" />
);

const starStyles3 = {
  itemShapes: Star,
  boxBorderWidth: 3,
  activeFillColor: "#00c950",
  activeBoxBorderColor: "#1c3d51",
  inactiveFillColor: "white",
};

export const RatingsStarBox = ({ value, style, className }) => {
  return (
    <Rating
      style={style}
      value={value}
      className={className}
      halfFillMode="svg"
      itemStyles={starStyles3}
      highlightOnlySelected={false}
      spaceInside="large"
      readOnly
    />
  );
};

const starStyles2 = {
  itemShapes: Heart,
  activeFillColor: "#f6339a",
  inactiveFillColor: "#fda5d5",
};
export const RatingHeart = ({ value, style }) => {
  return (
    <Rating style={style} value={value} itemStyles={starStyles2} readOnly />
  );
};

const starStyles4 = {
  itemShapes: StickerStar,
  activeFillColor: "#8200db",
  inactiveFillColor: "#dab2ff", 
};
export const RatingStarSticker = ({ value, style }) => {
  return (
    <Rating style={style} value={value} itemStyles={starStyles4} readOnly />
  );
};

export default RatingsStar;
