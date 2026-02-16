/**
 * Admin Login Page
 * Authentication page for admin panel access
 */

import React from 'react';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAdminLogin } from '../../../api/query';
import type { LoginRequest, ApiResponse } from '../../../api/types';
import LanguageSelector from '../../../components/languageSelector/LanguageSelector';
import './AdminLogin.scss';

const { Title, Text } = Typography;

const AdminLogin: React.FC = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const loginMutation = useAdminLogin();

  const onFinish = async (values: LoginRequest) => {
    try {
      await loginMutation.mutateAsync(values);
      message.success(t('auth.loginSuccess'));
    } catch (error) {
      const apiError = error as ApiResponse;
      message.error(apiError?.message || t('errors.loginFailed'));
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__language-selector">
        <LanguageSelector type="default" showLabel />
      </div>
      <div className="admin-login__container">
        <Card className="admin-login__card">
          <div className="admin-login__header">
            <div className="admin-login__logo">
              <span className="admin-login__logo-text">Otolor</span>
            </div>
            <Title level={3} className="admin-login__title">
              {t('auth.loginTitle')}
            </Title>
            <Text type="secondary" className="admin-login__subtitle">
              {t('auth.loginSubtitle')}
            </Text>
          </div>

          {loginMutation.isError && (
            <Alert
              message={t('errors.loginFailed')}
              description={(loginMutation.error as ApiResponse)?.message || t('errors.invalidCredentials')}
              type="error"
              showIcon
              className="admin-login__error"
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
              name="login"
              label={t('auth.usernameOrEmail')}
              rules={[
                { required: true, message: t('errors.usernameRequired') },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={t('auth.enterUsernameOrEmail')}
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={t('auth.password')}
              rules={[{ required: true, message: t('errors.passwordRequired') }]}
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
                loading={loginMutation.isPending}
                className="admin-login__button"
              >
                {loginMutation.isPending ? t('auth.signingIn') : t('auth.signIn')}
              </Button>
            </Form.Item>
          </Form>

          <div className="admin-login__footer">
            <Text type="secondary" style={{ fontSize: 12 }}>
              © {new Date().getFullYear()} {t('common.appName')}. {t('common.allRightsReserved')}.
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
