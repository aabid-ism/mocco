import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Custom hook used to manipulate context api
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("useAuthContext must be used inside an AuthContextProvider");
  }

  return context;
};
