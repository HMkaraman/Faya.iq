"use client";

import { useEffect, useRef, useCallback } from "react";

export function useUnsavedChanges(hasChanges: boolean) {
  const hasChangesRef = useRef(hasChanges);

  useEffect(() => {
    hasChangesRef.current = hasChanges;
  }, [hasChanges]);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (hasChangesRef.current) {
        e.preventDefault();
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const confirmNavigation = useCallback((callback: () => void) => {
    if (hasChangesRef.current) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        callback();
      }
    } else {
      callback();
    }
  }, []);

  return { confirmNavigation };
}
