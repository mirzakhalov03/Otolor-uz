/**
 * Unified language selector.
 * - variant="plain": flag-backed <select> for the public navbar
 * - variant="dropdown": AntD dropdown for the admin UI
 */

import React from 'react';
import { Dropdown, Button, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.scss';

const LANGS = [
  { key: 'uz', label: "O'zbekcha", short: 'UZ', flag: '🇺🇿' },
  { key: 'ru', label: 'Русский', short: 'RU', flag: '🇷🇺' },
  { key: 'en', label: 'English', short: 'ENG', flag: '🇬🇧' },
];

interface Props {
  variant?: 'plain' | 'dropdown';
  type?: 'default' | 'text';
  showLabel?: boolean;
}

const LanguageSwitcher: React.FC<Props> = ({ variant = 'plain', type = 'text', showLabel = false }) => {
  const { i18n } = useTranslation();
  const current = LANGS.find((l) => l.key === i18n.language) || LANGS[0];
  const change = (key: string) => i18n.changeLanguage(key);

  if (variant === 'plain') {
    return (
      <select
        id="language-selector"
        value={current.key}
        onChange={(e) => change(e.target.value)}
        className={`outline-none language-selector ${current.key}`}
        aria-label="Select language"
      >
        {LANGS.map((l) => (
          <option key={l.key} value={l.key}>{l.short}</option>
        ))}
      </select>
    );
  }

  const items: MenuProps['items'] = LANGS.map((l) => ({
    key: l.key,
    label: (
      <Space>
        <span style={{ fontSize: 18 }}>{l.flag}</span>
        <span>{l.label}</span>
      </Space>
    ),
    onClick: () => change(l.key),
  }));

  return (
    <Dropdown menu={{ items, selectedKeys: [current.key] }} trigger={['click']} placement="bottomRight">
      <Button type={type} className="language-selector">
        <Space size="small">
          <GlobalOutlined style={{ fontSize: 18 }} />
          {showLabel && <span>{current.label}</span>}
          <span style={{ fontSize: 16 }}>{current.flag}</span>
        </Space>
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
