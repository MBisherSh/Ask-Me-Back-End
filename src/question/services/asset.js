import Asset from '../models/asset';
import { S3, Exception, statusCodes } from '../../../utils';
import { v4 as uuid } from 'uuid';

class AssetService {
	constructor(data) {
		this.isPrivate = data.isPrivate;
		this.key = data.key;
	}
	async create() {
		const result = await this.save();
		return { msg: `A asset has been created.`, data: { id: result.insertId, asset: this } };
	}

	async save() {
		return await Asset.create(this);
	}

	static async createLater(fieldName, extension, isPrivate) {
		let key = `${fieldName}-${uuid()}.${extension}`;
		const asset = await new AssetService({ key, isPrivate: true }).create();
		const putUrl = await S3.getSignedPutURL(key, isPrivate,1000);
		return { asset, putUrl };
	}

	static async getById(id) {
		let data;
		const asset = await Asset.getById(id);
		if (!asset) throw new Exception(statusCodes.ITEM_NOT_FOUND, 'This file does not exist.');
		if (asset.isPrivate) {
			let url = await S3.getSignedURL(asset.key, true);
			data = { asset: { id: asset.id, url } };
		} else {
			data = { asset: { id: asset.id, url: `mokhatat2d-assets-public.s3.us-east-2.amazonaws.com/${asset.key}` } };
		}
		return { data };
	}

	static async delete(id) {
		let deletedId;
		if (typeof id === 'string') deletedId = parseInt(id);
		else deletedId = id;
		const asset = await Asset.getById(deletedId);
		try {
			await S3.deleteFromS3(asset.key, asset.isPrivate);
		} catch (e) {}
		return await Asset.delete(deletedId);
	}
}

export default AssetService;
