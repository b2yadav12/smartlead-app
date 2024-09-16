import { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Col, Row, Flex, Checkbox } from 'antd';
import { EMAIL_CONFIG_FORM_FIELDS } from '../constants';

const {
	EMAIL_ENCRYPTION_TYPES,
	DEFAULT_SMTP_PORT,
	DEFAULT_IMAP_PORT,
	DEFAULT_SMTP_ENCRYPTION,
	DEFAULT_MESSAGE_PER_DAY,
} = EMAIL_CONFIG_FORM_FIELDS;

const EmailConfig = () => {
	const [form] = Form.useForm();
	const formValues = Form.useWatch([], form);

	const [formInitialValues, setInitialValues] = useState({
		smtpPort: DEFAULT_SMTP_PORT,
		smtpEncryption: DEFAULT_SMTP_ENCRYPTION,
		messagePerDay: DEFAULT_MESSAGE_PER_DAY,
		imapPort: DEFAULT_IMAP_PORT
	});

	useEffect(() => {
		console.log(`formValues`, formValues);
	}, [formValues]);

	return (
		<Form
			form={form}
			layout="vertical"
			name="emailSettings"
			initialValues={{ ...formInitialValues }}
		>
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
							},
							{
								max: 200,
								message: 'Please enter less than 200',
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
				<Button type="primary" htmlType="submit">
					Save Settings
				</Button>
			</Form.Item>
		</Form>
	);
};

export default EmailConfig;
