import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from "./locales";
import axios from "axios";

const getUserLocale = async () => {
  const savedLocale = localStorage.getItem("lng");
  if (savedLocale) {
    return savedLocale; // Используем сохранённую локаль
  }

  try {
    axios.get('/get-user-info')
      .then(res => {
        const data = res.data;

        const userLocale = data.country === "RU" ? "ru" : "en"; // Проверка региона
        localStorage.setItem("lng", userLocale); // Сохраняем локаль в localStorage
        return userLocale;
      })
      .catch(err => console.log(err))
  } catch (error) {
    console.error("Ошибка определения локали:", error);
    return "en"; // Локаль по умолчанию в случае ошибки
  }
};

getUserLocale()
.then(lng => {
  i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translations.en },
      ru: { translation: translations.ru },
    },
    lng: lng, // Устанавливаем локаль
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
}); // Получаем локаль

export default i18n;