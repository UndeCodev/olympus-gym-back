import { UploadApiResponse } from 'cloudinary'
import cloudinary from '../config/cloudinary'
import fs from 'node:fs'

type folder = 'products' | 'logos'

export const uploadImageToCloudinary = async (filePath: string, folder: folder): Promise<UploadApiResponse> => {
  const uploadImageRes = await cloudinary.uploader.upload(filePath, {
    folder: `olympus_gym/${folder ?? 'default'}`
  })

  fs.unlinkSync(filePath)

  return uploadImageRes
}
