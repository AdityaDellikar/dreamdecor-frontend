import React, { useState } from "react";
import { AiOutlineCustomerService } from "react-icons/ai";
import { FiMessageCircle } from "react-icons/fi";
import RaiseTicketModal from "./RaiseTicketModal";

export default function SupportWidget() {
  const [open, setOpen] = useState(false);       // desktop modal
  const [mobileOpen, setMobileOpen] = useState(false); // mobile menu

  return (
    <>
      {/* DESKTOP SUPPORT BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="
          hidden md:flex
          fixed bottom-6 right-6 z-50
          bg-[var(--brand)] text-white
          w-14 h-14 rounded-full
          shadow-lg hover:scale-105 transition
          items-center justify-center
        "
        aria-label="Support"
      >
        <AiOutlineCustomerService size={26} />
      </button>

      {/* MOBILE EXPANDABLE SUPPORT */}
      <div
        className="
          md:hidden
          fixed right-4
          bottom-[88px]
          z-50
          scale-90
          transition-transform
        "
      >
        {/* Expanded options */}
        {mobileOpen && (
          <div className="mb-3 flex flex-col items-end gap-3">
            {/* Raise Ticket */}
            <button
              onClick={() => {
                setOpen(true);
                setMobileOpen(false);
              }}
              className="
                px-4 py-2
                bg-white text-[var(--midchar)]
                rounded-full shadow-md
                text-sm font-medium
                hover:scale-105 transition
              "
            >
              Raise Ticket
            </button>

            {/* WhatsApp */}
            <button
              onClick={() =>
                window.open("https://wa.me/91123457890", "_blank")
              }
              className="
                px-4 py-2
                bg-[#25D366] text-white
                rounded-full shadow-md
                text-sm font-medium
                hover:scale-105 transition
              "
            >
              WhatsApp
            </button>
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="
            w-12 h-12
            bg-[var(--brand)] text-white
            rounded-full shadow-lg
            flex items-center justify-center
            active:scale-95 transition
          "
          aria-label="Support options"
        >
          <FiMessageCircle size={22} />
        </button>
      </div>

      {/* DESKTOP MODAL */}
      <RaiseTicketModal
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}