import jwt from 'jsonwebtoken';
import config from '../../../config/development.json';
import bcrypt from 'bcryptjs';
import { Exception, statusCodes, nodemailer } from '../../../utils';
import UserService from '../../user/services/user';
import moment from 'moment';

const { JWT_SECRET, EXPIRES_IN } = config.JWT;

class Authentication {
	static generateAccessToken(user) {
		return jwt.sign(user, JWT_SECRET, { expiresIn: EXPIRES_IN });
	}

	static authenticateToken(authHeader) {
		const token = authHeader && authHeader.split(' ')[1];
		if (token == null) throw new Exception(statusCodes.UNAUTHORIZED, 'Please sign in.');
		let userData;
		jwt.verify(token, JWT_SECRET, (err, user) => {
			if (err) throw new Exception(statusCodes.UNAUTHORIZED, 'Please sign in.');
			else userData = user;
		});
		return userData;
	}

	static async signUp(userData) {
		if (!userData.role) userData.role = 1;
		if (userData.role > 2) throw new Exception(statusCodes.UNAUTHORIZED, 'you are not allowed to do this');
		userData.passwordHash = await bcrypt.hash(userData.password, 12);
		const user = await new UserService(userData).createUser();
		const insertedUser = await UserService.findUserById(user.insertId);
		const { id, name, email, role, phone } = insertedUser;
		const token = Authentication.generateAccessToken({
			id,
			email,
			phone,
			role,
		});
		return { user: { id, name, email, phone, role }, token };
	}

	static async login(userData) {
		const { emailOrPhone, password } = userData;
		const user = await UserService.getByEmailOrPhone(emailOrPhone, emailOrPhone);
		if (!user) throw new Exception(statusCodes.ITEM_NOT_FOUND, 'no such user');
		else if (!(await bcrypt.compare(password, user.passwordHash)))
			throw new Exception(statusCodes.UNAUTHORIZED, 'wrong password');
		else {
			const token = Authentication.generateAccessToken({
				id: user.id,
				email: user.email,
				phone: user.phone,
				role: user.role,
			});
			const { id, name, email, phone, role, profileImageUrl } = user;
			return { user: { id, name, email, role, phone, profileImageUrl }, token };
		}
	}

	static async verifyJwtTokenAndGetUser(authorization) {
		if (!authorization)
			throw new Exception(statusCodes.UNAUTHORIZED, 'You are not logged in! Please log in to get access.');
		const token = authorization.split(' ')[1];

		const decoded = await new Promise((resolve, reject) => {
			jwt.verify(token, JWT_SECRET, (err, decoded) => {
				if (err) reject(new Exception(statusCodes.UNAUTHORIZED, 'Invalid access token'));
				else resolve(decoded);
			});
		});
		const user = await UserService.findUserById(decoded.id);
		if (!user)
			throw new Exception(statusCodes.UNAUTHORIZED, 'The user belonging to this token does no longer exist.');

		if (user.changedPasswordAt) {
			const changedTimestamp = parseInt(user.changedPasswordAt.getTime() / 1000, 10);

			if (decoded.iat < changedTimestamp)
				throw new Exception(statusCodes.UNAUTHORIZED, 'User recently changed password! Please log in again.');
		}
		return { id: decoded.id, email: decoded.email, role: decoded.role };
	}

	static async setCodeToUser(user, isPasswordVerification) {
		const code = Math.floor(100000 + Math.random() * 900000);
		const date = new Date();

		let fields;
		if (isPasswordVerification) fields = { passwordResetCode: code, passwordResetCodeAt: date };
		else fields = { verificationCode: code, verificationCodeAt: date };

		await UserService.updateUser(user.id, fields);
		return code;
	}

	static async requestCode(user, isPasswordVerification) {
		const reason = isPasswordVerification ? 'account reset password' : 'account verification';

		const verificationCode = await Authentication.setCodeToUser(user, isPasswordVerification);
		try {
			await nodemailer.sendVerificationCode(
				user.email,
				`Mokhatat2D ${reason} code`,
				`Your ${reason} code is ${verificationCode}`
			);
		} catch (e) {
			console.log(e);
			throw new Exception(
				statusCodes.SERVICE_UNAVAILABLE,
				'Sorry we could not send an email to your account, try later'
			);
		}
		return { msg: 'Code has been sent to your email successfully.' };
	}

	static async requestResetPasswordCode(emailOrPhone) {
		const userData = await UserService.getByEmailOrPhone(emailOrPhone, emailOrPhone);
		if (!userData) throw new Exception(statusCodes.ITEM_NOT_FOUND, 'no such email');

		return await Authentication.requestCode(userData, true);
	}

	static async changePassword(user, data) {
		const userData = await UserService.findUserById(user.id);
		if (!(await bcrypt.compare(data.oldPassword, userData.passwordHash)))
			throw new Exception(statusCodes.UNAUTHORIZED, 'wrong password');
		else {
			const newPasswordHash = await bcrypt.hash(data.newPassword, 12);
			const now = new Date();
			await UserService.updateUser(userData.id, { passwordHash: newPasswordHash, changedPasswordAt: now });
			return { msg: 'password changed successfully' };
		}
	}

	static async resetPassword(code, data) {
		const userData = await UserService.getByEmailOrPhone(data.emailOrPhone, data.emailOrPhone);
		if (!userData) throw new Exception(statusCodes.ITEM_NOT_FOUND, 'no such email');

		if (
			userData.passwordResetCode == code &&
			moment(userData.passwordResetCodeAt).isBetween(moment().subtract(1, 'hours'), moment())
		) {
			const passwordHash = await bcrypt.hash(data.newPassword, 12);
			await UserService.updateUser(userData.id, {
				passwordHash,
				passwordResetCode: null,
				passwordResetCodeAt: null,
			});
			return { msg: 'Password has been reset successfully.' };
		} else throw new Exception(statusCodes.BAD_REQUEST, 'Wrong verification code.');
	}

	static async restrictToAdmin(role) {
		if (role <= 2) throw new Exception(statusCodes.FORBIDDEN, 'You are not allowed to access this route.');
	}
}

export default Authentication;
