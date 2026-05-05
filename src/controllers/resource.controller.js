import resourceService from '../services/resource.service.js';
import { catchAsync } from '../middleware/errorHandler.js';

export const createResource = catchAsync(async (req, res) => {
  const resource = await resourceService.createResource(req.body);
  res.status(201).json({
    status: 'success',
    data: resource,
  });
});

export const getAllResources = catchAsync(async (req, res) => {
  const result = await resourceService.getAllResources(req.query);
  res.status(200).json({
    status: 'success',
    ...result,
  });
});

export const getResource = catchAsync(async (req, res) => {
  const resource = await resourceService.getResourceById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: resource,
  });
});

export const updateResource = catchAsync(async (req, res) => {
  const resource = await resourceService.updateResource(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    data: resource,
  });
});

export const deleteResource = catchAsync(async (req, res) => {
  await resourceService.deleteResource(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
