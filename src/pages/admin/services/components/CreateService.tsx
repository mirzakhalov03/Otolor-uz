/**
 * Create Service Component
 * Form for creating a new service
 */

import React from 'react';
import { Card, Form, Input, InputNumber, Select, Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCreateClinicService } from '../../../../api/query';
import type { CreateServiceRequest } from '../../../../api/services/clinicService.service';
import './CreateService.scss';

const { TextArea } = Input;

const CreateService: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const createMutation = useCreateClinicService();

  const handleSubmit = async (values: any) => {
    try {
      const payload: CreateServiceRequest = {
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
      };

      await createMutation.mutateAsync(payload);
      message.success('Service created successfully');
      navigate('/admins-otolor/services');
    } catch (error) {
      message.error('Failed to create service');
    }
  };

  const handleCancel = () => {
    navigate('/admins-otolor/services');
  };

  return (
    <div className="create-service-page">
      <Card title="Create New Service">
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
          </div>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
                Create Service
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateService;
