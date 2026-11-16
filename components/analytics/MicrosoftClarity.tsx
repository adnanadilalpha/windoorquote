"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim();

export default function MicrosoftClarity() {
  useEffect(() => {
    if (!PROJECT_ID) return;
    Clarity.init(PROJECT_ID);
  }, []);

  return null;
}
