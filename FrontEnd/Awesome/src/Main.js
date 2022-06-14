import React, { useMemo, useState, useCallback } from "react";
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from "react-native-paper";
import { I18nManager, useColorScheme } from "react-native";
import { Updates } from "expo";
// import { useColorScheme } from 'react-native-appearance';

import thunk from "redux-thunk";
import { Provider as ReduxProvider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import AppReducer from "./reducers";
import { io } from "socket.io-client";
import { socketUrl } from "./utils/Configuration";
import { PreferencesContext } from "./context/PreferencesContext";
import { RootNavigator } from "./navigations/RootNavigator";
import { enableScreens } from "react-native-screens";
import { AppStyles } from "./utils/AppStyles";
import { Voximplant } from "react-native-voximplant";
enableScreens();

const store = createStore(AppReducer, applyMiddleware(thunk));

export const Main = () => {
  const voximplant = Voximplant.getInstance();
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme === "dark" ? "dark" : "light");
  const [rtl] = useState(I18nManager.isRTL);
  const [load, setLoad] = useState(true);
  const [socketContext, setSocketContext] = useState(undefined);

  const removeSocketContext = async () => {
    await voximplant.disconnect();
    await socketContext.off("connect");
    await socketContext.off("disconnect");
    await socketContext.off("connect_error");
    await socketContext.off("room:chat");
    await socketContext.removeAllListeners(
      "connect",
      "disconnect",
      "connect_error",
      "room:chat"
    );
    await socketContext.removeAllListeners();
    await socketContext.disconnect();
    await socketContext.emit("disconnect");
    setSocketContext(undefined);
  };

  const createSocketContext = async (userId) => {
    // console.log('createSocketContext >> userId >> ' + userId)
    setSocketContext(
      io(socketUrl, {
        auth: {
          userId: userId,
          forceNew: true,
        },
      })
    );
  };

  const toggleLoad = () => {
    setLoad(!load);
  };

  const toggleTheme = () => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  };
  const toggleRTL = useCallback(() => {
    I18nManager.forceRTL(!rtl);
    Updates.reloadFromCache();
  }, [rtl]);

  const preferences = useMemo(
    () => ({
      load,
      toggleLoad,
      toggleTheme,
      toggleRTL,
      theme,
      rtl: rtl ? "right" : "left",
      socketContext,
      removeSocketContext,
      createSocketContext,
    }),
    [
      rtl,
      theme,
      toggleRTL,
      toggleTheme,
      load,
      toggleLoad,
      socketContext,
      removeSocketContext,
      createSocketContext,
    ]
  );

  return (
    <ReduxProvider store={store}>
      <PreferencesContext.Provider value={preferences}>
        <PaperProvider
          theme={
            theme === "light"
              ? {
                  ...DefaultTheme,
                  colors: {
                    ...DefaultTheme.colors,
                    primary: AppStyles.color.tint,
                  },
                }
              : {
                  ...DarkTheme,
                  colors: {
                    ...DarkTheme.colors,
                    primary: AppStyles.color.tint,
                  },
                }
          }
        >
          <RootNavigator />
          {/* <Text>Haha</Text> */}
        </PaperProvider>
      </PreferencesContext.Provider>
    </ReduxProvider>
  );
};
