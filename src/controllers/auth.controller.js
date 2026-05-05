import authService from '../services/auth.service.js';
import { catchAsync } from '../middleware/errorHandler.js';

export const register = catchAsync(async (req, res) => {
  const { email, password, name } = req.body;
  const result = await authService.register(email, password, name);
  
  res.status(201).json({
    status: 'success',
    data: result,
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

export const refresh = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refresh(refreshToken);

  res.status(200).json({
    status: 'success',
    data: tokens,
  });
});

export const logout = catchAsync(async (req, res) => {
  await authService.logout(req.user.id);
  
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
