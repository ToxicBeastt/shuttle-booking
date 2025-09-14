import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

const LanguageToggleButton: React.FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'id' ? 'en' : 'id';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <Button variant="outlined" onClick={toggleLanguage}>
      {i18n.language === 'id' ? t('english') : t('indonesian')}
    </Button>
  );
};

export default LanguageToggleButton;
