"use client";

import { useState } from "react";

export default function CircleButton({ children, onClick }) {
  return (
    <button className="bg-white rounded-full p-4" onClick={onClick}>
      {children}
    </button>
  );
}
