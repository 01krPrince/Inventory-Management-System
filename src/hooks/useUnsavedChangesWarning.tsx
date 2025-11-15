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

const UnsavedChangesContext = createContext<UnsavedChangesContextType | undefined>(undefined);

export const useUnsavedChanges = (): UnsavedChangesContextType => {
  const context = useContext(UnsavedChangesContext);
  if (!context) throw new Error("useUnsavedChanges must be used within UnsavedChangesProvider");
  return context;
};

/**
 * Hook to manage the browser's beforeunload warning.
 * FIX: This version is modified to ALWAYS show the warning upon navigation/close,
 * regardless of the 'hasUnsavedChanges' state.
 */
const useUnsavedChangesWarning = (hasUnsavedChanges: boolean) => {
  useEffect(() => {
    /**
     * @param {BeforeUnloadEvent} e
     */
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        // --- MODIFICATION START ---
        // Removed the 'if (hasUnsavedChanges)' check
        e.preventDefault();
        
        // Setting returnValue to any non-null string is required by 
        // the browser to trigger the standard "unsaved changes" warning dialog.
        // The actual string is often ignored by modern browsers.
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?"; 
        // --- MODIFICATION END ---
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  // Since we are ignoring 'hasUnsavedChanges', we can technically remove it from the dependency array, 
  // but it's kept here as it's passed into the hook, and for consistency with the original structure.
  // In this new implementation, the effect only runs once on mount and cleans up on unmount.
  }, []); // Dependency array changed to '[]' to only run once.
};

export const UnsavedChangesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // NOTE: The 'isDirty' state is now effectively ignored by the warning hook
  // but is still provided for other components that might rely on it.
  const [isDirty, setIsDirty] = useState(false); 

  // Apply the fixed hook
  useUnsavedChangesWarning(isDirty);

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