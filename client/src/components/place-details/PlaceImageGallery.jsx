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
      className="relative col-span-4 xl:p-[120px] p-[70px] min-h-screen bg-gray-800 overflow-hidden"
    >
      <div className="absolute top-20 left-20 w-[162px] h-[160px] bg-[url('/images/icon-e.png')] bg-cover bg-center -rotate-15 opacity-25" />
      <div className="w-full text-center -mt-3 mb-12">
        <h1 className="font-extrabold text-white text-6xl text-wrap capitalize">
          Some shots of <span className="text-indigo-500">the scene</span>
        </h1>
      </div>
      <p
        className="font-medium text-lg text-gray-400 mb-8"
        data-aos="fade-left"
      >
        Nothing is much better than visually experiencing the scenic beauties of
        your chosen destination! But how is that possible without you being
        physically present? Thus keeping your desires in mind, destinify
        promises you to provide a short glimpse of the place you opt to travel
        by providing some of the best snaps captured in the lenses by our fellow
        travellers. Hope you enjoy watching them for now atleast...
      </p>
      <div className="mb-6">
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
      </div>
      <div
        className="absolute bottom-0 left-0 w-full h-[100px] bg-blend-screen z-3"
        style={{ background: "linear-gradient(to top, #101828, transparent)" }}
      />

      <AnimatePresence>
        {selectedImg && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
          >
            <div className="absolute top-0 left-0 w-full flex items-center justify-end p-4 gap-3">
              <i className="fa-solid fa-magnifying-glass-plus text-gray-300 text-xl" />
              <i className="fa-solid fa-magnifying-glass-minus text-gray-300 text-xl" />
            </div>
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
