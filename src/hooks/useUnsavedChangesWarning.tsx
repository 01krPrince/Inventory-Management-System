// src/hooks/useUnsavedChangesWarning.tsx

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";

/**
 * @typedef {Object} UnsavedChangesContextType
 * @property {boolean} hasUnsavedChanges
 * @property {(dirty: boolean) => void} setHasUnsavedChanges
 */

// Define the type explicitly for better TypeScript support
type UnsavedChangesContextType = {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (dirty: boolean) => void;
};

const UnsavedChangesContext = createContext<
  UnsavedChangesContextType | undefined
>(undefined);

export const useUnsavedChanges = (): UnsavedChangesContextType => {
  const context = useContext(UnsavedChangesContext);
  if (!context)
    throw new Error(
      "useUnsavedChanges must be used within UnsavedChangesProvider"
    );
  return context;
};

const useUnsavedChangesWarning = () => {
  useEffect(() => {
    /**
     * @param {BeforeUnloadEvent} e
     */
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();

      e.returnValue =
        "You have unsaved changes. Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
};

export const UnsavedChangesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isDirty, setIsDirty] = useState(false);

  // Apply the fixed hook
  useUnsavedChangesWarning();

  const setDirty = useCallback((dirtyStatus: boolean) => {
    setIsDirty(dirtyStatus);
  }, []);

  const contextValue: UnsavedChangesContextType = {
    hasUnsavedChanges: isDirty,
    setHasUnsavedChanges: setDirty,
  };

  return (
    <UnsavedChangesContext.Provider value={contextValue}>
      {children}
    </UnsavedChangesContext.Provider>
  );
};
