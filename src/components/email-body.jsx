import { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { sendEmail } from "../services/email";
import Loader from "./Loader";

const SendEmail = () => {
	const [form] = Form.useForm();
	const formValues = Form.useWatch([], form);
	const [emailBody, setEmailBody] = useState('');
	const [isSubmitDisable, setIsSubmitDisable] = useState(true); // enable/disable state for send button
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		form
			.validateFields({ validateOnly: true })
			.then(() => setIsSubmitDisable(false))
			.catch(() => {
				setIsSubmitDisable(true);
			})
	}, [form, formValues]);

	const handleSubmit = async (values) => {
		const formData = {
			...values,
			body: emailBody,
			emailConfigId: localStorage.getItem('emailConfigId')
		};

		// Send email service call
		try {
			setIsLoading(true);
			const sendEmailData = await sendEmail({ payload: formData });

			if (sendEmailData.status) {
				message.success(sendEmailData.message);
				form.resetFields();
				setEmailBody('');
			}
		} catch (error) {
			message.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form
			form={form}
			layout="vertical"
			name="emailForm"
			onFinish={handleSubmit} // Submit form on button click
		>
			{isLoading && <Loader />}
			<Row gutter={16}>
				<Col span={24}>
					<Form.Item
						label="To"
						name="to"
						rules={[
							{ required: true, message: 'Please enter the recipient\'s email address!' },
							{ type: 'email', message: 'Please enter a valid email address!' },
						]}
					>
						<Input placeholder="Enter recipient's email" />
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={24}>
					<Form.Item
						label="Subject"
						name="subject"
						rules={[{ required: true, message: 'Please enter the subject!' }]}
					>
						<Input placeholder="Enter email subject" />
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={24}>
					<Form.Item label="Body" name="body" required style={{ height: '280px' }}>
						<ReactQuill
							value={emailBody}
							onChange={setEmailBody}
							placeholder="Enter email body"
							style={{ height: '200px' }}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Form.Item>
				<Button type="primary" htmlType="submit" disabled={isSubmitDisable || !emailBody}>
					Send Email
				</Button>
			</Form.Item>
		</Form>
	);
};

export default SendEmail;
