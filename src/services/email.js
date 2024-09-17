import { mutation } from './gql';
import { SAVE_EMAIL_CONFIG, GET_EMAIL_CONFIG, SEND_EMAIL } from "../gql";

export const saveEmailConfig = async (payload) => {
	const data = await mutation(SAVE_EMAIL_CONFIG, payload);
	return data.saveEmailConfig;
};

export const getEmailConfig = async (id) => {
	const data = await mutation(GET_EMAIL_CONFIG, { id });
	return data.getEmailConfig;
};

export const sendEmail = async (payload) => {
	const data = await mutation(SEND_EMAIL, payload);
	return data.sendEmail;
}