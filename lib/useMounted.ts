"use client";

import { useEffect, useState } from "react";

/**
 * Returns false on the server and the very first client render, true after
 * mount. Used to gate rendering of persisted (localStorage) state so the
 * client markup matches the server's and React doesn't throw a hydration
 * mismatch.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
