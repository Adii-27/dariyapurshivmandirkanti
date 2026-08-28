export type Language = "en" | "hi";

export interface TranslationDictionary {
  nav: {
    home: string;
    about: string;
    heritage: string;
    gallery: string;
    sangeet: string;
    seva: string;
    visitorInfo: string;
    location: string;
    faq: string;
    contact: string;
    updates: string;
    installApp: string;
  };
  languageSelector: {
    label: string;
    english: string;
    hindi: string;
  };
  footer: {
    quickLinks: string;
    visitorInfo: string;
    connectWithUs: string;
    templeNotifications: string;
    installApp: string;
    websiteVisitors: string;
    openGoogleMaps: string;
    notificationsOn: string;
    notificationsOff: string;
    turnOnNotifications: string;
    subscribedConfirmation: string;
    appInstalledTitle: string;
    installAppTitle: string;
    appInstalledDesc: string;
    installAppDesc: string;
    openMenu: string;
    closeMenu: string;
  };
  common: {
    back: string;
    close: string;
    view: string;
    explore: string;
    learnMore: string;
    search: string;
    retry: string;
  };
}
