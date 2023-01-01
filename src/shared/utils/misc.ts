import { userAgents } from './constant';
import { includes } from 'lodash';

export const getResponseFormat = (
  statusCode: number,
  message: string,
  data: any = null,
  error: any = null,
) => ({
  statusCode,
  message,
  data,
  error,
});

export const ImageOptions = {
  fileFilter: (req, file, cb) => {
    // allowed types
    const types = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (includes(types, file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 1000000,
  },
};

export const selectRandomUser = () => {
  const randomNumber = Math.floor(Math.random() * userAgents.length);
  return userAgents[randomNumber];
};
