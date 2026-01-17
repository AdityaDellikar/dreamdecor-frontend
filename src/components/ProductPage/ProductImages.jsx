import React, { useState, useEffect, useMemo } from "react";
import ReactImageMagnify from "react-image-magnify";

export default function ProductImages({ images = [], name }) {
  // Normalize image objects
  const normalizedImages = useMemo(
    () =>
      images.map((img) =>
        typeof img === "string"
          ? { url: img }
          : img?.url
          ? { url: img.url }
          : { url: "" }
      ),
    [images]
  );

  const [selectedImage, setSelectedImage] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (normalizedImages.length > 0) {
      setSelectedImage(normalizedImages[0].url);
    }
  }, [normalizedImages]);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!normalizedImages.length) {
    return (
      <div className="text-gray-500 text-center">
        <div className="w-full max-w-md aspect-square bg-gray-200 rounded-xl flex items-center justify-center">
          No Images Available
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Main image */}
      <div className="w-full max-w-md aspect-square flex items-center justify-center">
        {isMobile ? (
          <img
            src={selectedImage}
            alt={name}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <ReactImageMagnify
            {...{
              smallImage: {
                alt: name,
                isFluidWidth: true,
                src: selectedImage,
              },
              largeImage: {
                src: selectedImage,
                width: 1200,
                height: 1200,
              },
              enlargedImageContainerDimensions: {
                width: "150%",
                height: "150%",
              },
              lensStyle: { backgroundColor: "rgba(0,0,0,.2)" },
            }}
          />
        )}
      </div>

      {/* Thumbnails */}
      <div
        className={`mt-6 ${
          isMobile
            ? "flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-2"
            : "flex gap-4 flex-wrap justify-center"
        }`}
        role="list"
        aria-label={`${name} product thumbnails`}
      >
        {normalizedImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img.url)}
            className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition shrink-0 ${
              selectedImage === img.url
                ? "border-[var(--brand)]"
                : "border-transparent"
            }`}
            aria-label={`Select image ${index + 1} of ${name}`}
            role="listitem"
          >
            <img
              src={img.url}
              alt={`${name} ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}