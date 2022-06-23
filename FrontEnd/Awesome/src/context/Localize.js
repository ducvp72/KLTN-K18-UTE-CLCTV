import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RNLocalize from "react-native-localize";
// import { Platform, NativeModules } from 'react-native'

import en from "../utils/language/en";
import vn from "../utils/language/vi";
import zh from "../utils/language/zh";

// const deviceLanguage =
//       Platform.OS === 'ios'
//         ? NativeModules.SettingsManager.settings.AppleLocale ||
//           NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
//         : NativeModules.I18nManager.localeIdentifier;

// console.log('RNLocalize.getLocales >> ' + JSON.stringify(RNLocalize.getLocales()[0].languageCode))

const LANGUAGES = {
  en,
  vn,
  zh,
};

const LANG_CODES = Object.keys(LANGUAGES);

const LANGUAGE_DETECTOR = {
  type: "languageDetector",
  async: true,
  detect: (callback) => {
    AsyncStorage.getItem("user-language", (err, language) => {
      // if error fetching stored data or no language was stored
      // display errors when in DEV mode as console statements
      if (err || !language) {
        if (err) {
          console.log("Error fetching Languages from asyncstorage ", err);
        } else {
          console.log(`No language is set, choosing locale as fallback`);
        }

        const findBestAvailableLanguage =
          RNLocalize.findBestAvailableLanguage(LANG_CODES);
        // console.log('findBestAvailableLanguage >> ' + JSON.stringify(findBestAvailableLanguage))

        try {
          const locale = RNLocalize.getLocales()[0].languageCode;
          callback(findBestAvailableLanguage.languageTag || locale);
        } catch {
          callback("en");
        }

        return;
      }
      callback(language);
    });
  },
  init: () => {},
  cacheUserLanguage: (language) => {
    AsyncStorage.setItem("user-language", language);
  },
};

i18n
  // detect language
  .use(LANGUAGE_DETECTOR)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // set options
  .init({
    compatibilityJSON: "v3",
    resources: LANGUAGES,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    defaultNS: "common",
  });
