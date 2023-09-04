import { commonChains, validator } from '../../../utils';
import Joi from 'joi';

const signUp = validator.generator({
	schema: {
		name: commonChains.namesRequired,
		email: commonChains.emailRequired,
		phone: commonChains.stringRequired,
		password: commonChains.passwordRequired,
		role: Joi.number().optional().min(1).max(2).integer(),
	},
	type: 'body',
});

const login = validator.generator({
	schema: {
		emailOrPhone: commonChains.stringRequired,
		password: commonChains.stringRequired,
	},
	type: 'body',
});

const verify = validator.generator({
	schema: {
		code: commonChains.numberRequired,
	},
	type: 'query',
});

const requestPasswordResetCode = validator.generator({
	schema: {
		emailOrPhone: commonChains.stringRequired,
	},
	type: 'body',
});

const changePassword = validator.generator({
	schema: {
		newPassword: commonChains.passwordRequired,
		oldPassword: commonChains.stringRequired,
	},
	type: 'body',
});

const resetPassword = validator.generator(
	{
		schema: {
			code: commonChains.numberRequired,
		},
		type: 'query',
	},
	{
		schema: {
			emailOrPhone: commonChains.stringRequired,
			newPassword: commonChains.passwordRequired,
		},
		type: 'body',
	}
);

export default { signUp, login, verify, resetPassword, changePassword, requestPasswordResetCode };
