import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../App.css'

const languages = [
    { code: "en", lang: "English" },
    { code: "fr", lang: "French" },
    { code: "ar", lang: "Arabic" },
    { code: "ta", lang: "Tamazight" },
];

const Languageselector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

useEffect(() => {
    document.body.dir = i18n.dir(i18n.language); // Ensure this line is executed correctly
  }, [i18n.language]);

  return (
    <div className='btn_container'>
      {languages.map((lng) => (
        <button key={lng.code} onClick={() => changeLanguage(lng.code)}>
          {lng.lang}
        </button>
      ))}
    </div>
  );
};

export default Languageselector;
