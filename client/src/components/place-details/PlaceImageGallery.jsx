import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Masonry from "react-masonry-css";

// const IMAGES = [
//   { id: 1, src: "/images/Goa.jpg" },
//   { id: 2, src: "/images/Kerala.jpg" },
//   { id: 3, src: "/images/Himalayas.jpg" },
//   { id: 4, src: "/images/Leh.jpg" },
//   { id: 5, src: "/images/Manali.jpg" },
//   { id: 6, src: "/images/Odisha.jpg" },
//   { id: 7, src: "/images/Punjab.jpg" },
//   { id: 8, src: "/images/Sikkim.jpg" },
//   { id: 9, src: "/images/Udaipur.jpg" },
//   { id: 10, src: "/images/city-bg.jpg" },
// ];
const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const PlaceImageGallery = ({ images }) => {
  const [selectedImg, setSelectedImg] = useState(null);
  // useEffect(() => {
  //   console.log(images);
  // }, [images]);

  return (
    <section
      id="place-img-gallery"
      className="relative col-span-4 xl:p-[120px] p-[70px] min-h-screen bg-gray-800"
    >
      <div className="w-full text-center -mt-3 mb-18">
        <h1 className="font-extrabold text-white text-6xl text-wrap capitalize">
          Some shots of <span className="text-indigo-500">the scene</span>
        </h1>
      </div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-4"
        columnClassName="bg-clip-padding"
      >
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            layoutId={`img-${idx}`}
            onClick={() => setSelectedImg({ src: img, id: idx })}
            className="mb-4 cursor-pointer hover:shadow-lg shadow-gray-600 transition-shadow duration-200 group"
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <img
              src={img}
              alt=""
              className="w-full rounded-xl object-cover group-hover:scale-103 transition-transform duration-300"
            />
          </motion.div>
        ))}
      </Masonry>

      <AnimatePresence>
        {selectedImg && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
          >
            <motion.img
              src={selectedImg.src}
              alt=""
              layoutId={`img-${selectedImg.id}`}
              className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PlaceImageGallery;
