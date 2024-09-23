import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Radio, Col, Row, Flex, Checkbox, message } from 'antd';
import { EMAIL_CONFIG_FORM_FIELDS } from '../constants';
import { saveEmailConfig, getEmailConfig } from "../services/email";
import Loader from "./Loader";

const {
	EMAIL_ENCRYPTION_TYPES,
	DEFAULT_SMTP_PORT,
	DEFAULT_IMAP_PORT,
	DEFAULT_SMTP_ENCRYPTION,
	DEFAULT_MESSAGE_PER_DAY,
} = EMAIL_CONFIG_FORM_FIELDS;

const getInitialFormValues = () => {
	return {
		smtpPort: DEFAULT_SMTP_PORT,
		smtpEncryption: DEFAULT_SMTP_ENCRYPTION,
		messagePerDay: DEFAULT_MESSAGE_PER_DAY,
		imapPort: DEFAULT_IMAP_PORT
	};
}

/**
 * EmailConfig component allows users to configure SMTP and IMAP settings, including encryption types, ports, and credentials.
 * The component fetches initial data if an email configuration ID is found in local storage then prefilled form fields.
*/
const EmailConfig = ({ updateEmailConfigId }) => {
	const [form] = Form.useForm();
	const formValues = Form.useWatch([], form);
	const [isSubmitDisable, setIsSubmitDisable] = useState(true); // enable/disable state for save button
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		fetchInitialData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Validate form fields and enable/disable save button
	useEffect(() => {
		form
			.validateFields({ validateOnly: true })
			.then(() => setIsSubmitDisable(false))
			.catch((err) => {
				setIsSubmitDisable(err.errorFields?.length > 0);
			})
	}, [form, formValues]);

	/**
	 * if emailConfigurationId is found then fetch the corresponding email configuration data and sets the form fields.
	*/
	const fetchInitialData = async () => {
		const savedEmailConfigId = localStorage.getItem('emailConfigId');

		if (savedEmailConfigId) {
			try {
				setIsLoading(true);
				const savedData = await getEmailConfig(savedEmailConfigId);

				if(savedData.useDifferentEmailForImap) {
					savedData.useDifferentEmail = savedData.useDifferentEmailForImap;
				}
				if(savedData.replyToEmail) {
					savedData.isReplyToDifferentEmail = true;
				}
				form.setFieldsValue(savedData);
			} catch (error) {
				updateEmailConfigId('');
				message.error(error.message);
			} finally {
				setIsLoading(false);
			}
		}
	}

	// parsing form fields from string to required data types
	const handleValuesChange = (changedValues) => {
		if (changedValues.smtpPort) {
			form.setFieldValue('smtpPort', parseInt(changedValues.smtpPort));
		} else if (changedValues.imapPort) {
			form.setFieldValue('imapPort', parseInt(changedValues.imapPort));
		} else if (changedValues.messagePerDay) {
			form.setFieldValue('messagePerDay', parseInt(changedValues.messagePerDay));
		} else if (changedValues.minTimeGap) {
			form.setFieldValue('minTimeGap', parseInt(changedValues.minTimeGap));
		}
	};

	// Save email configuration data
	const onSubmitForm = async () => {
		const data = { ...formValues, id: localStorage.getItem('emailConfigId') };

		data.useDifferentEmailForImap = data.useDifferentEmail;
		delete data.isReplyToDifferentEmail;
		delete data.useDifferentEmail;

		try {
			setIsLoading(true);
			const savedData = await saveEmailConfig({ payload: data });

			message.success("Email configuration saved successfully");

			form.setFieldsValue(savedData);
			updateEmailConfigId(savedData.id);
		} catch (error) {
			message.error(error.message);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form
			form={form}
			layout="vertical"
			name="emailSettings"
			initialValues={getInitialFormValues()}
			onValuesChange={handleValuesChange}
			onFinish={onSubmitForm}
		>
			{isLoading && <Loader />}
			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						label="From Name"
						name="fromName"
						rules={[
							{
								required: true,
								message: 'Please enter from name',
							},
						]}
					>
						<Input placeholder="Enter from name" />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label="From Email"
						name="fromEmail"
						rules={[
							{
								required: true,
								message: 'Please enter from email',
							},
							{
								type: 'email',
								message: 'Please enter valid email',
							}
						]}
					>
						<Input placeholder="Enter from email" />
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						label="User Name"
						name="username"
						rules={[
							{
								required: true,
								message: 'Please enter username',
							},
						]}
					>
						<Input placeholder="Enter username" />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label="Password"
						name="password"
						rules={[
							{
								required: true,
								message: 'Please enter password',
							},
						]}
					>
						<Input.Password placeholder="Enter password" />
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						label="SMTP Host"
						name="smtpHost"
						rules={[
							{
								required: true,
								message: 'Please enter SMTP host',
							},
						]}
					>
						<Input placeholder='smtp.zoho.com' />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item
						label="SMTP Port"
						name="smtpPort"
						rules={[
							{
								required: true,
								message: 'Please enter SMTP port',
							},
							{
								pattern: /^[0-9]*$/,
								message: 'Please enter valid port',
							}
						]}
					>
						<Input placeholder='465' />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Flex style={{ height: '100%' }}>
						<Form.Item name="smtpEncryption" style={{ marginBottom: 'auto', marginTop: 'auto' }}>
							<Radio.Group>
								{Object.keys(EMAIL_ENCRYPTION_TYPES).map((key) => {
									const value = EMAIL_ENCRYPTION_TYPES[key];
									return <Radio key={value} value={value}>
										{value}
									</Radio>
								})}
							</Radio.Group>
						</Form.Item>
					</Flex>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						label="Message Per Day"
						name="messagePerDay"
						rules={[
							{
								required: true,
								message: 'Please enter message per day',
							},
							{
								pattern: /^[0-9]*$/,
								message: 'Please enter valid number',
							}
						]}
					>
						<Input placeholder="200" />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label="Minimum time gap" name="minTimeGap">
						<Input placeholder="Enter time gap" />
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={12}>
					<Form.Item name="isReplyToDifferentEmail" valuePropName="checked" style={{ marginBottom: '5px' }}>
						<Checkbox>
							Set a different reply to address
						</Checkbox>
					</Form.Item>
					{formValues?.isReplyToDifferentEmail === true &&
						<Form.Item name="replyToEmail">
							<Input placeholder="Enter email" />
						</Form.Item>
					}
				</Col>
			</Row>

			<h3>IMAP Settings (receiving emails)</h3>

			<Form.Item name="useDifferentEmail" valuePropName="checked">
				<Checkbox>
					Use different email accounts for receiving emails
				</Checkbox>
			</Form.Item>

			{formValues?.useDifferentEmail === true && <><Row gutter={16}>
				<Col span={12}>
					<Form.Item
						label="IMAP Host"
						name="imapHost"
						rules={[
							{
								required: true,
								message: 'Please enter IMAP host',
							},
						]}
					>
						<Input placeholder='imap.zoho.com' />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item
						label="IMAP Port"
						name="imapPort"
						rules={[
							{
								required: true,
								message: 'Please enter IMAP port',
							},
							{
								pattern: /^[0-9]*$/,
								message: 'Please enter valid port',
							}
						]}
					>
						<Input placeholder='993' />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Flex style={{ height: '100%' }}>
						<Form.Item
							name="imapEncryption"
							style={{ marginBottom: 'auto', marginTop: 'auto' }}
							rules={[
								{
									required: true,
									message: 'Please select encryption type',
								},
							]}
						>
							<Radio.Group>
								{Object.keys(EMAIL_ENCRYPTION_TYPES).map((key) => {
									const value = EMAIL_ENCRYPTION_TYPES[key];
									return <Radio key={value} value={value}>
										{value}
									</Radio>
								})}
							</Radio.Group>
						</Form.Item>
					</Flex>
				</Col>
			</Row>
			</>}

			<Form.Item>
				<Button disabled={isSubmitDisable} type="primary" htmlType="submit">
					Save Settings
				</Button>
			</Form.Item>
		</Form>
	);
};

/*
	updateEmailConfigId: function to update email configuration ID once the email configuration is saved
*/
EmailConfig.propTypes = {
	updateEmailConfigId: PropTypes.func.isRequired,
};

export default EmailConfig;