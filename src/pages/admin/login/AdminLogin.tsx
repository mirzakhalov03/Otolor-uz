/**
 * Admin Login Page
 * Hardcoded authentication for admin panel access
 */

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
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
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);

    // Small delay to feel realistic
    await new Promise((r) => setTimeout(r, 500));

    const result = login(values.username, values.password);

    if (result.success) {
      message.success('Welcome back, Admin!');
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admins-otolor';
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="admin-login">
      <div className="admin-login__container">
        <Card className="admin-login__card">
          <div className="admin-login__header">
            <div className="admin-login__logo">
              <span className="admin-login__logo-text">Otolor</span>
            </div>
            <Title level={3} className="admin-login__title">
              Admin Panel
            </Title>
            <Text type="secondary" className="admin-login__subtitle">
              Sign in to manage your clinic
            </Text>
          </div>

          {error && (
            <Alert
              message="Login Failed"
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
              label="Username"
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter username"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter password"
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
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>

          <div className="admin-login__footer">
            <Text type="secondary" style={{ fontSize: 12 }}>
              © {new Date().getFullYear()} Otolor. All rights reserved.
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
