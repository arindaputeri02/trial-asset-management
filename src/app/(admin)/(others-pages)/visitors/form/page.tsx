"use client";

import { Suspense } from "react";
import VisitorFormContent from "./VisitorFormContent";

export default function VisitorFormPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <VisitorFormContent />
    </Suspense>
  );
}
