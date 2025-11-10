"use client";

import { Suspense } from "react";
import DriverFormContent from "./DriverFormContent";

export default function DriverFormPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <DriverFormContent />
    </Suspense>
  );
}
