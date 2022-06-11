import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider } from 'react-native-appearance';
import { Main } from './src/Main'
import { CallScreen } from './src/screens/CallScreen/CallScreen'
import { Platform } from 'react-native';
import { enableScreens } from 'react-native-screens';
import './src/context/Localize'
enableScreens(false);
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  "Overwriting fontFamily style attribute preprocessor"
]);
LogBox.ignoreLogs(["EventEmitter.removeListener"]);
LogBox.ignoreLogs([`new NativeEventEmitter`]);
// AppRegistry.registerHeadlessTask('HomeScreen', () =>
//   require('HomeScreen')
// );

const App = () => {

  const OS = Platform.OS
  console.log(OS === 'android')
  return (
    <>
    { OS === 'android' ? (
      <SafeAreaProvider>
      <AppearanceProvider>
        <Main />
      </AppearanceProvider>
      </SafeAreaProvider>
    ) : (
      <SafeAreaProvider>
      <AppearanceProvider>
        <Main />
      </AppearanceProvider>
      </SafeAreaProvider>
    )}
    </>

  );
}

export default App
