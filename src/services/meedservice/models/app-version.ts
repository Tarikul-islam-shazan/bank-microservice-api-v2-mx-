import mongoose, { Schema, Document } from 'mongoose';
import { IAppVersion, DevicePlatform } from '../../models/meedservice/app-version';

const AppVersionSchema = new Schema(
  {
    version: {
      type: String
    },
    updateUrl: {
      type: String
    },
    platform: {
      type: String,
      enum: {
        values: Object.values(DevicePlatform),
        message: '{VALUE} is not an acceptable value for {PATH}'
      },
      required: [true, 'Device platform is required']
    },
    checkUpgrade: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    }
  }
);

export interface IAppVersionModel extends IAppVersion, Document {}

export const AppVersionModel = mongoose.model<IAppVersionModel>('AppVersion', AppVersionSchema);
