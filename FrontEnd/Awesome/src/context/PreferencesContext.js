import React from "react";
export const PreferencesContext = React.createContext({
  socketContext: undefined,
  rtl: "left",
  theme: "light",
  toggleTheme: () => {},
  toggleRTL: () => {},
  load: true,
  toggleLoad: () => {},
  removeSocketContext: () => {},
  createSocketContext: () => {}
});
