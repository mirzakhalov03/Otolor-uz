/**
 * Unauthorized Page
 * Shown when user doesn't have required permissions
 */

import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f5f5f5',
      }}
    >
      <Result
        status="403"
        title="403"
        subTitle={t('errors.unauthorized')}
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/')}>
            {t('common.goHome')}
          </Button>,
          <Button key="back" onClick={() => navigate(-1)}>
            {t('common.goBack')}
          </Button>,
        ]}
      />
    </div>
  );
};

export default Unauthorized;
