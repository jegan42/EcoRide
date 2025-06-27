// frontend/src/services/emailService.ts
import api from '../api/axios';
import { API_URL } from '../constants/api';
import type { ApiResponse } from '../types/api';
import type { EmailBody } from '../types/email';
import {
    handleApiResponseSafe,
} from '../utils/handleApiResponse';

const sendMail = async (
  emailBody: EmailBody
): Promise<ApiResponse<void>> => {
  const response = await api.post(`${API_URL}/sendemail`, emailBody, {
    withCredentials: true,
  });
  console.log('sendResponse', response)
  return handleApiResponseSafe<void>(response.data);
};

export default {
    sendMail,
};
