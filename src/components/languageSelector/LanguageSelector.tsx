/**
 * Language Selector Component
 * Dropdown for switching between Uzbek, Russian, and English
 */

import React from 'react';
import { Dropdown, Button, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.scss';

interface LanguageSelectorProps {
  type?: 'default' | 'text';
  showLabel?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  type = 'text',
  showLabel = false 
}) => {
  const { i18n } = useTranslation();

  const languages = [
    { key: 'uz', label: 'O\'zbekcha', flag: '🇺🇿' },
    { key: 'ru', label: 'Русский', flag: '🇷🇺' },
    { key: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const currentLanguage = languages.find(lang => lang.key === i18n.language) || languages[0];

  const handleLanguageChange = (languageKey: string) => {
    i18n.changeLanguage(languageKey);
  };

  const menuItems: MenuProps['items'] = languages.map((lang) => ({
    key: lang.key,
    label: (
      <Space>
        <span style={{ fontSize: 18 }}>{lang.flag}</span>
        <span>{lang.label}</span>
      </Space>
    ),
    onClick: () => handleLanguageChange(lang.key),
  }));

  return (
    <Dropdown
      menu={{ items: menuItems, selectedKeys: [i18n.language] }}
      trigger={['click']}
      placement="bottomRight"
    >
      <Button type={type} className="language-selector">
        <Space size="small">
          <GlobalOutlined style={{ fontSize: 18 }} />
          {showLabel && <span>{currentLanguage.label}</span>}
          <span style={{ fontSize: 16 }}>{currentLanguage.flag}</span>
        </Space>
      </Button>
    </Dropdown>
  );
};

export default LanguageSelector;
