import { errorResponse } from '../../../shared/utils/response.js';

export const notFoundHandler = (req, res, next) => {
  return errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};
