/**
 * Edit Service Component
 * Form for editing an existing service
 */

import React, { useEffect } from 'react';
import { Card, Form, Input, InputNumber, Select, Button, Space, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useClinicService, useUpdateClinicService } from '../../../../api/query';
import type { UpdateServiceRequest } from '../../../../api/services/clinicService.service';
import './EditService.scss';

const { TextArea } = Input;

const EditService: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();

  const { data: service, isLoading } = useClinicService(id || '', !!id);
  const updateMutation = useUpdateClinicService();

  useEffect(() => {
    if (service) {
      form.setFieldsValue({
        nameUz: service.name.uz,
        nameRu: service.name.ru,
        nameEn: service.name.en,
        descriptionUz: service.description.uz,
        descriptionRu: service.description.ru,
        descriptionEn: service.description.en,
        category: service.category,
        price: service.price,
        duration: service.duration,
        isActive: service.isActive,
      });
    }
  }, [service, form]);

  const handleSubmit = async (values: any) => {
    if (!id) return;

    try {
      const payload: UpdateServiceRequest = {
        name: {
          uz: values.nameUz,
          ru: values.nameRu,
          en: values.nameEn,
        },
        description: {
          uz: values.descriptionUz,
          ru: values.descriptionRu,
          en: values.descriptionEn,
        },
        category: values.category,
        price: values.price,
        duration: values.duration,
        isActive: values.isActive,
      };

      await updateMutation.mutateAsync({ id, data: payload });
      message.success('Service updated successfully');
      navigate('/admins-otolor/services');
    } catch (error) {
      message.error('Failed to update service');
    }
  };

  const handleCancel = () => {
    navigate('/admins-otolor/services');
  };

  if (isLoading) {
    return (
      <div className="edit-service-page">
        <Card>
          <Spin size="large" />
        </Card>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="edit-service-page">
        <Card>Service not found</Card>
      </div>
    );
  }

  return (
    <div className="edit-service-page">
      <Card title={`Edit Service: ${service.name.en}`}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          {/* Name in all languages */}
          <div className="form-section">
            <h3>Service Name</h3>
            <Form.Item
              label="Name (Uzbek)"
              name="nameUz"
              rules={[{ required: true, message: 'Please enter name in Uzbek' }]}
            >
              <Input placeholder="Xizmat nomi" />
            </Form.Item>

            <Form.Item
              label="Name (Russian)"
              name="nameRu"
              rules={[{ required: true, message: 'Please enter name in Russian' }]}
            >
              <Input placeholder="Название услуги" />
            </Form.Item>

            <Form.Item
              label="Name (English)"
              name="nameEn"
              rules={[{ required: true, message: 'Please enter name in English' }]}
            >
              <Input placeholder="Service name" />
            </Form.Item>
          </div>

          {/* Description in all languages */}
          <div className="form-section">
            <h3>Service Description</h3>
            <Form.Item
              label="Description (Uzbek)"
              name="descriptionUz"
              rules={[{ required: true, message: 'Please enter description in Uzbek' }]}
            >
              <TextArea rows={3} placeholder="Xizmat tavsifi" />
            </Form.Item>

            <Form.Item
              label="Description (Russian)"
              name="descriptionRu"
              rules={[{ required: true, message: 'Please enter description in Russian' }]}
            >
              <TextArea rows={3} placeholder="Описание услуги" />
            </Form.Item>

            <Form.Item
              label="Description (English)"
              name="descriptionEn"
              rules={[{ required: true, message: 'Please enter description in English' }]}
            >
              <TextArea rows={3} placeholder="Service description" />
            </Form.Item>
          </div>

          {/* Service details */}
          <div className="form-section">
            <h3>Service Details</h3>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select placeholder="Select category">
                <Select.Option value="Consultation">Consultation</Select.Option>
                <Select.Option value="Diagnostics">Diagnostics</Select.Option>
                <Select.Option value="Treatment">Treatment</Select.Option>
                <Select.Option value="Surgery">Surgery</Select.Option>
                <Select.Option value="Therapy">Therapy</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Price ($)"
              name="price"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="0.00" />
            </Form.Item>

            <Form.Item
              label="Duration (minutes)"
              name="duration"
              rules={[{ required: true, message: 'Please enter duration' }]}
            >
              <InputNumber min={5} max={480} style={{ width: '100%' }} placeholder="30" />
            </Form.Item>

            <Form.Item label="Status" name="isActive">
              <Select>
                <Select.Option value={true}>Active</Select.Option>
                <Select.Option value={false}>Inactive</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
                Update Service
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditService;
