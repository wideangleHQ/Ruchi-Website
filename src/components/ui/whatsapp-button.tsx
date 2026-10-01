"use client";

import React from "react";

export function WhatsAppButton() {
  const phoneNumber = "919124754082";
  const defaultMessage = encodeURIComponent(
    "Hello Ruchi Foodline! I would like to inquire about your products and offers."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <aside
      aria-label="Contact via WhatsApp"
      className="hidden md:flex fixed bottom-6 right-6 z-40 items-center pointer-events-auto"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Ruchi Foodline on WhatsApp"
        title="Chat on WhatsApp"
        className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-white/40 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      >
        {/* WhatsApp Official SVG Icon */}
        <svg
          className="w-7 h-7 fill-current shrink-0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.101-.476-.15-.677.15-.2.3-.777.978-.953 1.178-.175.2-.351.226-.652.075-.3-.15-1.267-.467-2.414-1.49-1.282-1.144-1.637-2.22-1.838-2.571-.201-.351-.021-.541.13-.69.135-.136.3-.351.451-.527.15-.175.2-.3.301-.501.1-.201.05-.376-.025-.527-.075-.15-.677-1.631-.927-2.232-.244-.585-.492-.506-.677-.515-.175-.008-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.301-1.053 1.029-1.053 2.509 0 1.48 1.078 2.909 1.228 3.11.15.201 2.122 3.24 5.141 4.544.718.31 1.278.496 1.715.635.721.23 1.377.197 1.896.12.577-.087 1.78-.727 2.03-1.429.251-.702.251-1.304.176-1.43-.075-.125-.276-.2-.577-.35zM12.04 21.785c-1.761 0-3.488-.474-5.004-1.372l-.359-.213-3.722.977.994-3.628-.233-.371a9.816 9.816 0 0 1-1.504-5.234c0-5.437 4.423-9.86 9.864-9.86 2.634 0 5.109 1.026 6.97 2.888a9.805 9.805 0 0 1 2.89 6.974c-.001 5.438-4.425 9.861-9.896 9.861zm7.708-17.57C17.682 2.148 14.962 1 12.04 1 5.962 1 1.01 5.952 1.008 12.032c0 1.943.507 3.84 1.47 5.509L1 23l5.632-1.477c1.609.877 3.421 1.34 5.27 1.34 6.077 0 11.029-4.952 11.031-11.033 0-2.946-1.147-5.714-3.191-7.615z" />
        </svg>
      </a>
    </aside>
  );
}
