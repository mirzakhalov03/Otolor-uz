/**
 * Doctor Form Component
 * Reusable form for creating and editing doctors
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Row,
  Col,
  Divider,
  Typography,
  Spin,
} from 'antd';
import { UserOutlined, LockOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useCheckUsername } from '../../../../api/query';
import type { Doctor } from '../../../../api/types';
import type { CreateDoctorRequest, UpdateDoctorRequest } from '../../../../api/services/doctor.service';
import { debounce } from '../../../../utils';
import './DoctorForm.scss';

const { TextArea } = Input;
const { Text } = Typography;

// Available days options
const AVAILABLE_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Common qualification options
const QUALIFICATION_OPTIONS = [
  'MD',
  'PhD',
  'MBBS',
  'MS',
  'DNB',
  'DM',
  'MCh',
  'FRCS',
  'MRCP',
];

export interface DoctorFormProps {
  /** Initial doctor data for edit mode */
  initialData?: Doctor | null;
  /** Whether the form is in edit mode */
  isEditMode?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Submit handler */
  onSubmit: (values: CreateDoctorRequest | UpdateDoctorRequest) => Promise<void>;
  /** Cancel handler */
  onCancel: () => void;
  /** Submit button loading state */
  isSubmitting?: boolean;
}

const DoctorForm: React.FC<DoctorFormProps> = ({
  initialData,
  isEditMode = false,
  isLoading = false,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [usernameToCheck, setUsernameToCheck] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null);

  // Check username availability
  const { data: usernameData, isFetching: isCheckingUsername } = useCheckUsername(
    usernameToCheck,
    !isEditMode && usernameToCheck.length >= 3
  );

  // Update username validity when check completes
  useEffect(() => {
    if (usernameData) {
      setIsUsernameValid(usernameData.isAvailable);
    }
  }, [usernameData]);

  // Populate form with initial data in edit mode
  useEffect(() => {
    if (initialData && isEditMode) {
      form.setFieldsValue({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        specialization: initialData.specialization,
        qualifications: initialData.qualifications,
        experience: initialData.experience,
        bio: initialData.bio,
        consultationFee: initialData.consultationFee,
        availableDays: initialData.availableDays,
        workingHours: initialData.workingHours,
        isActive: initialData.isActive,
        username: initialData.user?.username || '',
      });
    }
  }, [initialData, isEditMode, form]);

  // Debounced username check
  const debouncedUsernameCheck = useCallback(
    debounce((value: string) => {
      if (value && value.length >= 3) {
        setUsernameToCheck(value);
      } else {
        setUsernameToCheck('');
        setIsUsernameValid(null);
      }
    }, 500),
    []
  );

  // Handle username change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    form.setFieldValue('username', value);
    setIsUsernameValid(null);
    debouncedUsernameCheck(value);
  };

  // Handle form submission
  const handleFinish = async (values: CreateDoctorRequest | UpdateDoctorRequest) => {
    // Clean up empty values
    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== undefined && v !== '')
    );

    // Remove password if empty in edit mode
    if (isEditMode && !cleanedValues.password) {
      delete cleanedValues.password;
    }

    await onSubmit(cleanedValues as CreateDoctorRequest | UpdateDoctorRequest);
  };

  // Username validation status
  const getUsernameValidationStatus = () => {
    if (isCheckingUsername) return 'validating';
    if (isUsernameValid === true) return 'success';
    if (isUsernameValid === false) return 'error';
    return undefined;
  };

  // Username suffix icon
  const getUsernameSuffix = () => {
    if (isCheckingUsername) return <Spin size="small" />;
    if (isUsernameValid === true) return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    if (isUsernameValid === false) return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
    return null;
  };

  if (isLoading) {
    return (
      <div className="doctor-form__loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      autoComplete="off"
      className="doctor-form"
      requiredMark="optional"
    >
      {/* Account Credentials Section */}
      <div className="doctor-form__section">
        <Typography.Title level={5}>
          <UserOutlined /> {t('admin.doctorForm.accountCredentials', 'Account Credentials')}
        </Typography.Title>
        <Text type="secondary">
          {isEditMode
            ? t('admin.doctorForm.accountCredentialsEditHint', 'Leave password empty to keep current password')
            : t('admin.doctorForm.accountCredentialsHint', 'These credentials will be used for doctor login')}
        </Text>
        <Divider />

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={t('admin.doctorForm.username', 'Username')}
              name="username"
              rules={[
                { required: !isEditMode, message: t('admin.doctorForm.usernameRequired', 'Username is required') },
                { min: 3, message: t('admin.doctorForm.usernameMinLength', 'Username must be at least 3 characters') },
                { max: 30, message: t('admin.doctorForm.usernameMaxLength', 'Username cannot exceed 30 characters') },
                { pattern: /^[a-z0-9_]+$/, message: t('admin.doctorForm.usernamePattern', 'Only lowercase letters, numbers, and underscores') },
              ]}
              validateStatus={getUsernameValidationStatus()}
              help={isUsernameValid === false ? t('admin.doctorForm.usernameTaken', 'Username is already taken') : undefined}
            >
              <Input
                prefix={<UserOutlined />}
                suffix={!isEditMode && getUsernameSuffix()}
                placeholder={t('admin.doctorForm.usernamePlaceholder', 'e.g., dr_john_smith')}
                onChange={handleUsernameChange}
                disabled={isEditMode} // Username cannot be changed after creation
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={t('admin.doctorForm.password', 'Password')}
              name="password"
              rules={[
                { required: !isEditMode, message: t('admin.doctorForm.passwordRequired', 'Password is required') },
                { min: 8, message: t('admin.doctorForm.passwordMinLength', 'Password must be at least 8 characters') },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: t('admin.doctorForm.passwordPattern', 'Must include uppercase, lowercase, and number'),
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={isEditMode 
                  ? t('admin.doctorForm.passwordPlaceholderEdit', 'Leave empty to keep current') 
                  : t('admin.doctorForm.passwordPlaceholder', 'Enter password')
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </div>

      {/* Personal Information Section */}
      <div className="doctor-form__section">
        <Typography.Title level={5}>
          {t('admin.doctorForm.personalInfo', 'Personal Information')}
        </Typography.Title>
        <Divider />

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={t('admin.doctorForm.firstName', 'First Name')}
              name="firstName"
              rules={[
                { required: true, message: t('admin.doctorForm.firstNameRequired', 'First name is required') },
                { max: 50, message: t('admin.doctorForm.firstNameMaxLength', 'First name cannot exceed 50 characters') },
              ]}
            >
              <Input placeholder={t('admin.doctorForm.firstNamePlaceholder', 'Enter first name')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={t('admin.doctorForm.lastName', 'Last Name')}
              name="lastName"
              rules={[
                { required: true, message: t('admin.doctorForm.lastNameRequired', 'Last name is required') },
                { max: 50, message: t('admin.doctorForm.lastNameMaxLength', 'Last name cannot exceed 50 characters') },
              ]}
            >
              <Input placeholder={t('admin.doctorForm.lastNamePlaceholder', 'Enter last name')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={t('admin.doctorForm.email', 'Email')}
              name="email"
              rules={[
                { required: true, message: t('admin.doctorForm.emailRequired', 'Email is required') },
                { type: 'email', message: t('admin.doctorForm.emailInvalid', 'Please enter a valid email') },
              ]}
            >
              <Input placeholder={t('admin.doctorForm.emailPlaceholder', 'doctor@example.com')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={t('admin.doctorForm.phone', 'Phone')}
              name="phone"
              rules={[
                { required: true, message: t('admin.doctorForm.phoneRequired', 'Phone number is required') },
              ]}
            >
              <Input placeholder={t('admin.doctorForm.phonePlaceholder', '+998 90 123 45 67')} />
            </Form.Item>
          </Col>
        </Row>
      </div>

      {/* Professional Information Section */}
      <div className="doctor-form__section">
        <Typography.Title level={5}>
          {t('admin.doctorForm.professionalInfo', 'Professional Information')}
        </Typography.Title>
        <Divider />

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={t('admin.doctorForm.specialization', 'Specialization')}
              name="specialization"
              rules={[
                { required: true, message: t('admin.doctorForm.specializationRequired', 'Specialization is required') },
              ]}
            >
              <Input placeholder={t('admin.doctorForm.specializationPlaceholder', 'e.g., Cardiologist')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={t('admin.doctorForm.experience', 'Experience (years)')}
              name="experience"
              rules={[
                { required: true, message: t('admin.doctorForm.experienceRequired', 'Experience is required') },
              ]}
            >
              <InputNumber min={0} max={60} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={t('admin.doctorForm.qualifications', 'Qualifications')}
              name="qualifications"
              rules={[
                { required: true, message: t('admin.doctorForm.qualificationsRequired', 'At least one qualification is required') },
              ]}
            >
              <Select
                mode="tags"
                placeholder={t('admin.doctorForm.qualificationsPlaceholder', 'Add qualifications (e.g., MD, PhD)')}
                options={QUALIFICATION_OPTIONS.map(q => ({ value: q, label: q }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={t('admin.doctorForm.consultationFee', 'Consultation Fee')}
              name="consultationFee"
              rules={[
                { required: true, message: t('admin.doctorForm.consultationFeeRequired', 'Consultation fee is required') },
              ]}
            >
              <InputNumber
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

        <Form.Item
          label={t('admin.doctorForm.bio', 'Bio')}
          name="bio"
        >
          <TextArea
            rows={4}
            maxLength={1000}
            showCount
            placeholder={t('admin.doctorForm.bioPlaceholder', 'Brief description about the doctor...')}
          />
        </Form.Item>
      </div>

      {/* Availability Section */}
      <div className="doctor-form__section">
        <Typography.Title level={5}>
          {t('admin.doctorForm.availability', 'Availability')}
        </Typography.Title>
        <Divider />

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={t('admin.doctorForm.availableDays', 'Available Days')}
              name="availableDays"
            >
              <Select
                mode="multiple"
                placeholder={t('admin.doctorForm.availableDaysPlaceholder', 'Select available days')}
                options={AVAILABLE_DAYS.map(day => ({ value: day, label: day }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Space>
              <Form.Item
                label={t('admin.doctorForm.workingHoursStart', 'Working Hours Start')}
                name={['workingHours', 'start']}
              >
                <Input placeholder="09:00" style={{ width: 120 }} />
              </Form.Item>
              <Form.Item
                label={t('admin.doctorForm.workingHoursEnd', 'Working Hours End')}
                name={['workingHours', 'end']}
              >
                <Input placeholder="17:00" style={{ width: 120 }} />
              </Form.Item>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Status Section (Edit mode only) */}
      {isEditMode && (
        <div className="doctor-form__section">
          <Typography.Title level={5}>
            {t('admin.doctorForm.status', 'Status')}
          </Typography.Title>
          <Divider />

          <Form.Item
            label={t('admin.doctorForm.accountStatus', 'Account Status')}
            name="isActive"
          >
            <Select>
              <Select.Option value={true}>{t('admin.doctorForm.active', 'Active')}</Select.Option>
              <Select.Option value={false}>{t('admin.doctorForm.inactive', 'Inactive')}</Select.Option>
            </Select>
          </Form.Item>
        </div>
      )}

      {/* Form Actions */}
      <div className="doctor-form__actions">
        <Space>
          <Button onClick={onCancel}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            disabled={!isEditMode && isUsernameValid === false}
          >
            {isEditMode
              ? t('admin.doctorForm.updateDoctor', 'Update Doctor')
              : t('admin.doctorForm.createDoctor', 'Create Doctor')}
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default DoctorForm;
