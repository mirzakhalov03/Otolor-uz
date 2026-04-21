/**
 * Admin Login Page
 * Hardcoded authentication for admin panel access
 */

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/languageSelector/LanguageSelector';
import './AdminLogin.scss';

const { Title, Text } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);

    // Small delay to feel realistic
    await new Promise((r) => setTimeout(r, 500));

    const result = login(values.username, values.password);

    if (result.success) {
      message.success(t('adminLogin.toasts.welcomeBack'));
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admins-otolor';
      navigate(from, { replace: true });
    } else {
      setError(t(result.messageKey));
    }

    setLoading(false);
  };

  return (
    <div className="admin-login">
      <div className="admin-login__language-selector">
        <LanguageSelector type="text" showLabel />
      </div>
      <div className="admin-login__container">
        <Card className="admin-login__card">
          <div className="admin-login__header">
            <div className="admin-login__logo">
              <span className="admin-login__logo-text">Otolor</span>
            </div>
            <Title level={3} className="admin-login__title">
              {t('adminLogin.title')}
            </Title>
            <Text type="secondary" className="admin-login__subtitle">
              {t('adminLogin.subtitle')}
            </Text>
          </div>

          {error && (
            <Alert
              message={t('adminLogin.loginFailedTitle')}
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              style={{ marginBottom: 24 }}
            />
          )}

          <Form
            form={form}
            name="admin_login"
            onFinish={onFinish}
            size="large"
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item
              name="username"
              label={t('auth.username')}
              rules={[{ required: true, message: t('adminLogin.validation.enterUsername') }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={t('auth.enterUsername')}
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={t('auth.password')}
              rules={[{ required: true, message: t('adminLogin.validation.enterPassword') }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('auth.enterPassword')}
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="admin-login__button"
              >
                {loading ? t('auth.signingIn') : t('auth.signIn')}
              </Button>
            </Form.Item>
          </Form>

          <div className="admin-login__footer">
            <Text type="secondary" style={{ fontSize: 12 }}>
              © {new Date().getFullYear()} Otolor. {t('common.allRightsReserved')}
            </Text>
            <br />
            <br />
            <Link to="/" className='p-2 border rounded-lg'>Bosh sahifaga qaytish</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
