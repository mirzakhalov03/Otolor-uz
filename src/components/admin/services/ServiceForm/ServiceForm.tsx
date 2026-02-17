/**
 * Service Form Component
 * Reusable form for creating and editing clinic services
 */

import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  Select,
  Switch,
  Divider,
  Row,
  Col,
  Upload,
} from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import {
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { ClinicService } from '../../../../api/types';
import type { CreateServiceRequest, UpdateServiceRequest } from '../../../../api/services/clinicService.service';
import './ServiceForm.scss';

const { TextArea } = Input;

interface ServiceFormProps {
  /** Initial data for editing */
  initialData?: ClinicService;
  /** Whether form is in edit mode */
  isEditMode?: boolean;
  /** Submit handler */
  onSubmit: (values: CreateServiceRequest | UpdateServiceRequest) => Promise<void>;
  /** Cancel handler */
  onCancel: () => void;
  /** Form loading state */
  isLoading?: boolean;
}

// Service categories
const SERVICE_CATEGORIES = [
  'Consultation',
  'Diagnostics',
  'Treatment',
  'Surgery',
  'Rehabilitation',
  'Laboratory',
  'Imaging',
  'Other',
];

// Currency options
const CURRENCIES = [
  { value: 'UZS', label: 'UZS (Uzbek Sum)' },
  { value: 'USD', label: 'USD (US Dollar)' },
];

const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  isEditMode = false,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const currentLang = i18n.language as 'uz' | 'ru' | 'en';

  // Initialize form with data
  useEffect(() => {
    if (initialData && isEditMode) {
      form.setFieldsValue({
        nameUz: initialData.name?.uz || '',
        nameRu: initialData.name?.ru || '',
        nameEn: initialData.name?.en || '',
        descriptionUz: initialData.description?.uz || '',
        descriptionRu: initialData.description?.ru || '',
        descriptionEn: initialData.description?.en || '',
        category: initialData.category || '',
        price: initialData.price || 0,
        currency: 'UZS',
        duration: initialData.duration || 30,
        isActive: initialData.isActive ?? true,
      });
      
      if (initialData.image?.url) {
        setFileList([{
          uid: '-1',
          name: 'service-image',
          status: 'done',
          url: initialData.image.url,
        }]);
      }
    } else {
      form.setFieldsValue({
        currency: 'UZS',
        duration: 30,
        isActive: true,
      });
    }
  }, [initialData, isEditMode, form]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const formData: CreateServiceRequest | UpdateServiceRequest = {
        name: {
          uz: values.nameUz as string || '',
          ru: values.nameRu as string || '',
          en: values.nameEn as string || '',
        },
        description: {
          uz: values.descriptionUz as string || '',
          ru: values.descriptionRu as string || '',
          en: values.descriptionEn as string || '',
        },
        category: values.category as string,
        price: values.price as number,
        duration: values.duration as number,
      };

      if (isEditMode) {
        (formData as UpdateServiceRequest).isActive = values.isActive as boolean;
      }

      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const uploadProps: UploadProps = {
    listType: 'picture-card',
    fileList,
    maxCount: 1,
    beforeUpload: () => false, // Prevent auto upload
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="service-form"
      disabled={isLoading}
    >
      {/* Service Name (Localized) */}
      <div className="service-form__section">
        <h3 className="service-form__section-title">
          {t('admin.services.serviceName', 'Service Name')}
        </h3>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="nameUz"
              label={t('languages.uzbek', 'Uzbek')}
              rules={[
                { required: currentLang === 'uz', message: t('validation.required', 'Required') },
                { max: 100, message: t('validation.maxLength', { max: 100 }) },
              ]}
            >
              <Input placeholder={t('admin.services.enterNameUz', 'Enter name in Uzbek')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="nameRu"
              label={t('languages.russian', 'Russian')}
              rules={[
                { required: currentLang === 'ru', message: t('validation.required', 'Required') },
                { max: 100, message: t('validation.maxLength', { max: 100 }) },
              ]}
            >
              <Input placeholder={t('admin.services.enterNameRu', 'Enter name in Russian')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="nameEn"
              label={t('languages.english', 'English')}
              rules={[
                { required: currentLang === 'en', message: t('validation.required', 'Required') },
                { max: 100, message: t('validation.maxLength', { max: 100 }) },
              ]}
            >
              <Input placeholder={t('admin.services.enterNameEn', 'Enter name in English')} />
            </Form.Item>
          </Col>
        </Row>
      </div>

      {/* Description (Localized) */}
      <div className="service-form__section">
        <h3 className="service-form__section-title">
          {t('admin.services.description', 'Description')}
        </h3>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="descriptionUz"
              label={t('languages.uzbek', 'Uzbek')}
              rules={[
                { max: 1000, message: t('validation.maxLength', { max: 1000 }) },
              ]}
            >
              <TextArea 
                rows={3} 
                placeholder={t('admin.services.enterDescriptionUz', 'Enter description in Uzbek')} 
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="descriptionRu"
              label={t('languages.russian', 'Russian')}
              rules={[
                { max: 1000, message: t('validation.maxLength', { max: 1000 }) },
              ]}
            >
              <TextArea 
                rows={3} 
                placeholder={t('admin.services.enterDescriptionRu', 'Enter description in Russian')} 
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="descriptionEn"
              label={t('languages.english', 'English')}
              rules={[
                { max: 1000, message: t('validation.maxLength', { max: 1000 }) },
              ]}
            >
              <TextArea 
                rows={3} 
                placeholder={t('admin.services.enterDescriptionEn', 'Enter description in English')} 
              />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* Service Details */}
      <div className="service-form__section">
        <h3 className="service-form__section-title">
          {t('admin.services.serviceDetails', 'Service Details')}
        </h3>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="category"
              label={t('admin.services.category', 'Category')}
              rules={[{ required: true, message: t('validation.required', 'Required') }]}
            >
              <Select
                placeholder={t('admin.services.selectCategory', 'Select category')}
                allowClear
                showSearch
              >
                {SERVICE_CATEGORIES.map(cat => (
                  <Select.Option key={cat} value={cat}>
                    {t(`admin.services.categories.${cat.toLowerCase()}`, cat)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="price"
              label={t('admin.services.price', 'Price')}
              rules={[
                { required: true, message: t('validation.required', 'Required') },
                { type: 'number', min: 0, message: t('validation.minValue', { min: 0 }) },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => Number(value?.replace(/,/g, '') || 0) as 0 & number}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="currency"
              label={t('admin.services.currency', 'Currency')}
            >
              <Select>
                {CURRENCIES.map(curr => (
                  <Select.Option key={curr.value} value={curr.value}>
                    {curr.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="duration"
              label={t('admin.services.duration', 'Duration (minutes)')}
              rules={[
                { type: 'number', min: 0, message: t('validation.minValue', { min: 0 }) },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                max={480}
                addonAfter={t('common.minutes', 'min')}
              />
            </Form.Item>
          </Col>
          {isEditMode && (
            <Col xs={24} md={8}>
              <Form.Item
                name="isActive"
                label={t('admin.services.status', 'Status')}
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={t('common.active', 'Active')}
                  unCheckedChildren={t('common.inactive', 'Inactive')}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
      </div>

      <Divider />

      {/* Service Image */}
      <div className="service-form__section">
        <h3 className="service-form__section-title">
          {t('admin.services.serviceImage', 'Service Image')}
        </h3>
        <Form.Item name="image">
          <Upload {...uploadProps}>
            {fileList.length === 0 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>{t('common.upload', 'Upload')}</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </div>

      <Divider />

      {/* Form Actions */}
      <div className="service-form__actions">
        <Space size="middle">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isLoading}
            size="large"
          >
            {isEditMode 
              ? t('common.saveChanges', 'Save Changes')
              : t('admin.services.createService', 'Create Service')
            }
          </Button>
          <Button
            onClick={onCancel}
            icon={<CloseOutlined />}
            size="large"
          >
            {t('common.cancel', 'Cancel')}
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default ServiceForm;
