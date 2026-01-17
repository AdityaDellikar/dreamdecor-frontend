import React, { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductReviews({ reviews = [] }) {
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    comment: "",
    rating: 0,
  });

  // Local list + MongoDB reviews merged
  const [allReviews, setAllReviews] = useState(reviews);

  const submitReview = (e) => {
    e.preventDefault();

    if (!newReview.name || !newReview.comment || newReview.rating === 0) return;

    setAllReviews([...allReviews, newReview]);

    setNewReview({ name: "", comment: "", rating: 0 });
    setShowModal(false);
  };

  return (
    <div className="mt-10 px-2 md:px-0">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-5">
        Customer Reviews
      </h2>

      {/* Review List */}
      <div className="space-y-4">
        {allReviews.length > 0 ? (
          allReviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-4 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
                <p className="font-semibold text-gray-800">{review.name}</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, idx) => (
                    <AiFillStar
                      key={idx}
                      className={idx < review.rating ? "" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">{review.comment}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first!</p>
        )}
      </div>

      {/* Add Review Button */}
      <div className="mt-6">
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-[var(--brand)] text-white rounded-xl hover:opacity-90 transition"
        >
          Add a Review
        </button>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-5 md:p-6 w-11/12 max-w-md shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <h3 className="text-base md:text-lg font-semibold mb-4">Write a Review</h3>

              <form onSubmit={submitReview} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300"
                />

                <textarea
                  placeholder="Your review"
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300"
                  rows={4}
                />

                {/* Star Rating */}
                <div className="flex space-x-3 text-yellow-400 text-xl">
                  {[...Array(5)].map((_, idx) => (
                    <AiFillStar
                      key={idx}
                      onClick={() =>
                        setNewReview({ ...newReview, rating: idx + 1 })
                      }
                      className={`cursor-pointer ${
                        idx < newReview.rating ? "" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}