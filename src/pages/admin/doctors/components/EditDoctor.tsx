/**
 * Edit Doctor Component
 * Form for editing an existing doctor
 */

import React, { useEffect } from 'react';
import { Card, Form, Input, InputNumber, Select, Button, Space, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDoctor, useUpdateDoctor } from '../../../../api/query';
import type { UpdateDoctorRequest } from '../../../../api/services/doctor.service';
import './EditDoctor.scss';

const { TextArea } = Input;

const EditDoctor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();

  const { data: doctor, isLoading } = useDoctor(id || '', !!id);
  const updateMutation = useUpdateDoctor();

  useEffect(() => {
    if (doctor) {
      form.setFieldsValue({
        specialization: doctor.specialization,
        experience: doctor.experience,
        qualifications: doctor.qualifications,
        bio: doctor.bio,
        consultationFee: doctor.consultationFee,
        availableDays: doctor.availableDays,
        isActive: doctor.isActive,
      });
    }
  }, [doctor, form]);

  const handleSubmit = async (values: UpdateDoctorRequest) => {
    if (!id) return;

    try {
      await updateMutation.mutateAsync({ id, data: values });
      message.success('Doctor updated successfully');
      navigate('/admins-otolor/doctors');
    } catch (error) {
      message.error('Failed to update doctor');
    }
  };

  const handleCancel = () => {
    navigate('/admins-otolor/doctors');
  };

  if (isLoading) {
    return (
      <div className="edit-doctor-page">
        <Card>
          <Spin size="large" />
        </Card>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="edit-doctor-page">
        <Card>Doctor not found</Card>
      </div>
    );
  }

  return (
    <div className="edit-doctor-page">
      <Card title={`Edit Doctor: ${doctor.fullName || `${doctor.firstName} ${doctor.lastName}`}`}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
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
            <Select mode="tags" placeholder="Add qualifications (e.g., MD, PhD)" />
          </Form.Item>

          <Form.Item label="Bio" name="bio">
            <TextArea rows={4} placeholder="Enter doctor bio" />
          </Form.Item>

          <Form.Item
            label="Consultation Fee ($)"
            name="consultationFee"
            rules={[{ required: true, message: 'Please enter consultation fee' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
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

          <Form.Item label="Account Status" name="isActive" valuePropName="checked">
            <Select>
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
                Update Doctor
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditDoctor;
