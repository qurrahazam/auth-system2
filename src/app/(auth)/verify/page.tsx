"use client";

import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Verifying...</div>}>
      <VerifyClient />
    </Suspense>
  );
}
