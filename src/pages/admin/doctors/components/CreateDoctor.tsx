/**
 * Create Doctor Component
 * Form for creating a new doctor
 */

import React from 'react';
import { Card, Form, Input, InputNumber, Select, Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCreateDoctor } from '../../../../api/query';
import type { CreateDoctorRequest } from '../../../../api/services/doctor.service';
import './CreateDoctor.scss';

const { TextArea } = Input;

const CreateDoctor: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const createMutation = useCreateDoctor();

  const handleSubmit = async (values: CreateDoctorRequest) => {
    try {
      await createMutation.mutateAsync(values);
      message.success('Doctor created successfully');
      navigate('/admins-otolor/doctors');
    } catch (error) {
      message.error('Failed to create doctor');
    }
  };

  const handleCancel = () => {
    navigate('/admins-otolor/doctors');
  };

  return (
    <div className="create-doctor-page">
      <Card title="Create New Doctor">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: 'Please enter first name' }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: 'Please enter last name' }]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="doctor@example.com" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input placeholder="+998 90 123 45 67" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Specialization"
            name="specialization"
            rules={[{ required: true, message: 'Please enter specialization' }]}
          >
            <Input placeholder="e.g., Cardiologist" />
          </Form.Item>

          <Form.Item
            label="Experience (years)"
            name="experience"
            rules={[{ required: true, message: 'Please enter experience' }]}
          >
            <InputNumber min={0} max={50} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Qualifications"
            name="qualifications"
            rules={[{ required: true, message: 'Please enter qualifications' }]}
          >
            <Select mode="tags" placeholder="Add qualifications (e.g., MD, PhD)">
              <Select.Option value="MD">
                MD
              </Select.Option>
              <Select.Option value="PhD">
                PhD
              </Select.Option>
              <Select.Option value="MBBS">
                MBBS
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Bio" name="bio">
            <TextArea rows={4} placeholder="Enter doctor bio" />
          </Form.Item>

          <Form.Item label="Available Days" name="availableDays">
            <Select mode="multiple" placeholder="Select available days">
              <Select.Option value="Monday">Monday</Select.Option>
              <Select.Option value="Tuesday">Tuesday</Select.Option>
              <Select.Option value="Wednesday">Wednesday</Select.Option>
              <Select.Option value="Thursday">Thursday</Select.Option>
              <Select.Option value="Friday">Friday</Select.Option>
              <Select.Option value="Saturday">Saturday</Select.Option>
              <Select.Option value="Sunday">Sunday</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Consultation Fee ($)"
            name="consultationFee"
            rules={[{ required: true, message: 'Please enter consultation fee' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
                Create Doctor
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateDoctor;
