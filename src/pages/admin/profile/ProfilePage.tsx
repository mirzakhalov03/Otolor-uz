/**
 * Profile Page
 * User profile management page - optimized for doctors with clean UI
 */

import React, { useState } from 'react';
import {
  Card,
  Typography,
  Avatar,
  Button,
  Form,
  Input,
  Row,
  Col,
  Divider,
  message,
  Space,
  Tag,
  Spin,
  InputNumber,
  Select,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
  TrophyOutlined,
  MedicineBoxOutlined,
  ClockCircleOutlined,
  StarOutlined,
  DollarOutlined,
  BookOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useDoctorWithUser, useUpdateDoctor } from '../../../api/query';
import type { Doctor } from '../../../api/types';
import './ProfilePage.scss';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface DoctorProfileFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  specialization?: string;
  experience?: number;
  consultationFee?: number;
  bio?: string;
  qualifications?: string[];
  languages?: string[];
}

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm<DoctorProfileFormValues>();

  const isDoctor = user?.role?.name === 'doctor';
  const doctorProfileId = user?.doctorProfile;
  
  // Fetch doctor profile if user is a doctor
  const { data: doctorData, isLoading: isLoadingDoctor } = useDoctorWithUser(
    typeof doctorProfileId === 'string' ? doctorProfileId : '',
    isDoctor && !!doctorProfileId
  );

  const updateDoctorMutation = useUpdateDoctor();

  // Get doctor info from API response
  const doctor = doctorData as Doctor | undefined;

  // Initialize form with current data
  const handleEdit = () => {
    if (isDoctor && doctor) {
      form.setFieldsValue({
        firstName: doctor.firstName || user?.firstName || '',
        lastName: doctor.lastName || user?.lastName || '',
        phone: doctor.phone || user?.phone || '',
        specialization: doctor.specialization || '',
        experience: doctor.experience || 0,
        consultationFee: doctor.consultationFee || 0,
        bio: doctor.bio || '',
        qualifications: doctor.qualifications || [],
      });
    } else {
      form.setFieldsValue({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
      });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSave = async (values: DoctorProfileFormValues) => {
    try {
      if (isDoctor && doctor) {
        await updateDoctorMutation.mutateAsync({
          id: doctor._id,
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            phone: values.phone,
            specialization: values.specialization,
            experience: values.experience,
            consultationFee: values.consultationFee,
            bio: values.bio,
            qualifications: values.qualifications,
          },
        });
      }
      message.success(t('profile.updateSuccess', 'Profile updated successfully'));
      setIsEditing(false);
    } catch {
      message.error(t('profile.updateError', 'Failed to update profile'));
    }
  };

  // Get role display config
  const getRoleConfig = () => {
    const roleName = user?.role?.name;
    const configs: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
      superadmin: { color: 'purple', label: t('admin.superAdmin', 'Super Admin'), icon: <SafetyCertificateOutlined /> },
      admin: { color: 'blue', label: t('admin.admin', 'Admin'), icon: <UserOutlined /> },
      doctor: { color: 'green', label: t('admin.doctor', 'Doctor'), icon: <MedicineBoxOutlined /> },
      user: { color: 'default', label: t('admin.user', 'User'), icon: <UserOutlined /> },
    };
    return configs[roleName || ''] || { color: 'default', label: roleName, icon: <UserOutlined /> };
  };

  const roleConfig = getRoleConfig();

  // Get user initials for avatar
  const getInitials = () => {
    const first = (isDoctor && doctor?.firstName?.[0]) || user?.firstName?.[0] || '';
    const last = (isDoctor && doctor?.lastName?.[0]) || user?.lastName?.[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  const displayName = isDoctor && doctor 
    ? `${doctor.firstName} ${doctor.lastName}`
    : `${user?.firstName} ${user?.lastName}`;

  const displayEmail = isDoctor && doctor ? doctor.email : user?.email;
  const displayPhone = isDoctor && doctor ? doctor.phone : user?.phone;

  if (isDoctor && isLoadingDoctor) {
    return (
      <div className="profile-page profile-page--loading">
        <Spin size="large" tip={t('common.loading', 'Loading...')} />
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Header Section */}
      <div className="profile-page__header">
        <div className="profile-page__header-content">
          <Avatar 
            size={120} 
            src={isDoctor && doctor?.profileImage?.url}
            icon={<UserOutlined />} 
            className="profile-page__avatar"
          >
            {getInitials()}
          </Avatar>
          <div className="profile-page__header-info">
            <Title level={2} className="profile-page__name">
              {displayName}
            </Title>
            <Space size={12} wrap>
              <Tag color={roleConfig.color} icon={roleConfig.icon}>
                {roleConfig.label}
              </Tag>
              {isDoctor && doctor?.specialization && (
                <Tag color="blue">{doctor.specialization}</Tag>
              )}
              <Tag color={user?.isActive ? 'success' : 'error'}>
                {user?.isActive ? t('profile.active', 'Active') : t('profile.inactive', 'Inactive')}
              </Tag>
            </Space>
            <div className="profile-page__header-contact">
              <Text type="secondary"><MailOutlined /> {displayEmail}</Text>
              {displayPhone && <Text type="secondary"><PhoneOutlined /> {displayPhone}</Text>}
            </div>
          </div>
          {!isEditing && (
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={handleEdit}
              className="profile-page__edit-btn"
            >
              {t('common.editProfile', 'Edit Profile')}
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        /* Edit Mode */
        <Card className="profile-page__edit-card">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            {/* Basic Information */}
            <Title level={4}>{t('profile.basicInfo', 'Basic Information')}</Title>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="firstName"
                  label={t('profile.firstName', 'First Name')}
                  rules={[{ required: true, message: t('validation.required', 'Required') }]}
                >
                  <Input size="large" prefix={<UserOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="lastName"
                  label={t('profile.lastName', 'Last Name')}
                  rules={[{ required: true, message: t('validation.required', 'Required') }]}
                >
                  <Input size="large" prefix={<UserOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label={t('profile.phone', 'Phone Number')}
                >
                  <Input size="large" prefix={<PhoneOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            {/* Doctor-specific fields */}
            {isDoctor && (
              <>
                <Divider />
                <Title level={4}>{t('profile.professionalInfo', 'Professional Information')}</Title>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="specialization"
                      label={t('profile.specialization', 'Specialization')}
                    >
                      <Input size="large" prefix={<MedicineBoxOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={6}>
                    <Form.Item
                      name="experience"
                      label={t('profile.experience', 'Years of Experience')}
                    >
                      <InputNumber 
                        size="large" 
                        min={0} 
                        max={60} 
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={6}>
                    <Form.Item
                      name="consultationFee"
                      label={t('profile.consultationFee', 'Consultation Fee')}
                    >
                      <InputNumber 
                        size="large" 
                        min={0}
                        style={{ width: '100%' }}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => {
                          const parsed = value?.replace(/\$\s?|(,*)/g, '');
                          return (parsed ? parseFloat(parsed) : 0) as 0;
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="qualifications"
                      label={t('profile.qualifications', 'Qualifications')}
                    >
                      <Select
                        mode="tags"
                        size="large"
                        placeholder={t('profile.enterQualifications', 'Enter qualifications')}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="languages"
                      label={t('profile.languages', 'Languages')}
                    >
                      <Select
                        mode="tags"
                        size="large"
                        placeholder={t('profile.enterLanguages', 'Enter languages')}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={24}>
                    <Form.Item
                      name="bio"
                      label={t('profile.bio', 'Biography')}
                    >
                      <TextArea 
                        rows={4} 
                        placeholder={t('profile.bioPlaceholder', 'Write a brief description about yourself...')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            <Divider />
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={updateDoctorMutation.isPending}
                size="large"
              >
                {t('common.saveChanges', 'Save Changes')}
              </Button>
              <Button 
                onClick={handleCancel}
                icon={<CloseOutlined />}
                size="large"
              >
                {t('common.cancel', 'Cancel')}
              </Button>
            </Space>
          </Form>
        </Card>
      ) : (
        /* View Mode */
        <Row gutter={[24, 24]}>
          {/* Stats Cards for Doctors */}
          {isDoctor && doctor && (
            <Col xs={24}>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Card className="profile-page__stat-card">
                    <div className="profile-page__stat-icon" style={{ background: '#e8f5e9' }}>
                      <TrophyOutlined style={{ color: '#4caf50' }} />
                    </div>
                    <div className="profile-page__stat-info">
                      <Text type="secondary">{t('profile.experience', 'Experience')}</Text>
                      <Title level={3}>{doctor.experience || 0} {t('common.years', 'yrs')}</Title>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card className="profile-page__stat-card">
                    <div className="profile-page__stat-icon" style={{ background: '#fff3e0' }}>
                      <StarOutlined style={{ color: '#ff9800' }} />
                    </div>
                    <div className="profile-page__stat-info">
                      <Text type="secondary">{t('profile.rating', 'Rating')}</Text>
                      <Title level={3}>{doctor.rating?.toFixed(1) || '0.0'}</Title>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card className="profile-page__stat-card">
                    <div className="profile-page__stat-icon" style={{ background: '#e3f2fd' }}>
                      <DollarOutlined style={{ color: '#2196f3' }} />
                    </div>
                    <div className="profile-page__stat-info">
                      <Text type="secondary">{t('profile.fee', 'Fee')}</Text>
                      <Title level={3}>${doctor.consultationFee || 0}</Title>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card className="profile-page__stat-card">
                    <div className="profile-page__stat-icon" style={{ background: '#f3e5f5' }}>
                      <ClockCircleOutlined style={{ color: '#9c27b0' }} />
                    </div>
                    <div className="profile-page__stat-info">
                      <Text type="secondary">{t('profile.reviews', 'Reviews')}</Text>
                      <Title level={3}>{doctor.totalReviews || 0}</Title>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          )}

          {/* Personal Information */}
          <Col xs={24} lg={isDoctor ? 12 : 24}>
            <Card 
              title={
                <Space><UserOutlined /> {t('profile.personalInfo', 'Personal Information')}</Space>
              }
              className="profile-page__info-card"
            >
              <div className="profile-page__info-grid">
                <div className="profile-page__info-item">
                  <Text type="secondary">{t('profile.fullName', 'Full Name')}</Text>
                  <Text strong>{displayName}</Text>
                </div>
                <div className="profile-page__info-item">
                  <Text type="secondary">{t('profile.email', 'Email')}</Text>
                  <Text strong>{displayEmail}</Text>
                </div>
                <div className="profile-page__info-item">
                  <Text type="secondary">{t('profile.phone', 'Phone')}</Text>
                  <Text strong>{displayPhone || '-'}</Text>
                </div>
                <div className="profile-page__info-item">
                  <Text type="secondary">{t('profile.username', 'Username')}</Text>
                  <Text strong>{user?.username || '-'}</Text>
                </div>
                <div className="profile-page__info-item">
                  <Text type="secondary">{t('profile.memberSince', 'Member Since')}</Text>
                  <Text strong>
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString() 
                      : '-'}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>

          {/* Professional Information (Doctors only) */}
          {isDoctor && doctor && (
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space><MedicineBoxOutlined /> {t('profile.professionalInfo', 'Professional Information')}</Space>
                }
                className="profile-page__info-card"
              >
                <div className="profile-page__info-grid">
                  <div className="profile-page__info-item">
                    <Text type="secondary">{t('profile.specialization', 'Specialization')}</Text>
                    <Text strong>{doctor.specialization || '-'}</Text>
                  </div>
                  <div className="profile-page__info-item">
                    <Text type="secondary">{t('profile.qualifications', 'Qualifications')}</Text>
                    <Space wrap size={4}>
                      {doctor.qualifications?.length ? (
                        doctor.qualifications.map((q, i) => (
                          <Tag key={i} color="blue">{q}</Tag>
                        ))
                      ) : (
                        <Text>-</Text>
                      )}
                    </Space>
                  </div>
                  <div className="profile-page__info-item">
                    <Text type="secondary">{t('profile.languages', 'Languages')}</Text>
                    <Space wrap size={4}>
                      {doctor.languages?.length ? (
                        doctor.languages.map((l, i) => (
                          <Tag key={i}>{l}</Tag>
                        ))
                      ) : (
                        <Text>-</Text>
                      )}
                    </Space>
                  </div>
                </div>
              </Card>
            </Col>
          )}

          {/* Bio (Doctors only) */}
          {isDoctor && doctor?.bio && (
            <Col xs={24}>
              <Card 
                title={
                  <Space><BookOutlined /> {t('profile.aboutMe', 'About Me')}</Space>
                }
                className="profile-page__info-card"
              >
                <Paragraph>{doctor.bio}</Paragraph>
              </Card>
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};

export default ProfilePage;
