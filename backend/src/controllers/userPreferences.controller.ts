// backend/src/controllers/userPreferences.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { PreferenceService } from '../services/userPreferences.service';
import { assertOwnership, requireUser } from '../utils/request';
import { sendJsonResponse } from '../utils/response';

export class PreferencesController {
  static readonly create = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!PreferenceService.isCreateInputValid(req.body)) {
      sendJsonResponse(
        res,
        'BAD_REQUEST',
        'UserPreferences',
        'Missing or invalid required fields'
      );
      return;
    }

    const { id } = req.params;
    if (!assertOwnership(req, res, id)) return;

    try {
      if (await PreferenceService.isExistUserPreferences(id)) {
        sendJsonResponse(
          res,
          'CONFLICT',
          'UserPreferences',
          'UserPreferences already exists'
        );
        return;
      }

      const { acceptsSmoker, acceptsPets, acceptsMusic, acceptsChatter } =
        req.body;

      const userPreferences = await prismaNewClient.userPreferences.create({
        data: {
          userId: id,
          acceptsSmoker,
          acceptsPets,
          acceptsMusic,
          acceptsChatter,
        },
      });

      if (!userPreferences) {
        sendJsonResponse(
          res,
          'NOT_FOUND',
          'UserPreferences',
          'userPreferences not found'
        );
        return;
      }

      sendJsonResponse(
        res,
        'SUCCESS_CREATE',
        'UserPreferences',
        'Created',
        'userPreferences',
        userPreferences
      );
    } catch {
      sendJsonResponse(
        res,
        'ERROR',
        'UserPreferences',
        'Failed to create userPreferences'
      );
    }
  };

  static readonly getUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const user = requireUser(req, res);
    if (!user) return;

    req.params.id = user.id;
    return PreferencesController.getByUserId(req, res);
  };

  static readonly getByUserId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    if (!assertOwnership(req, res, id)) return;

    try {
      const userPreferences = await prismaNewClient.userPreferences.findUnique({
        where: { userId: id },
      });
      if (!userPreferences) {
        sendJsonResponse(
          res,
          'NOT_FOUND',
          'UserPreferences',
          'userPreferences not found'
        );
        return;
      }

      sendJsonResponse(
        res,
        'SUCCESS',
        'UserPreferences',
        'UserPreferences founded',
        'userPreferences',
        userPreferences
      );
    } catch {
      sendJsonResponse(
        res,
        'ERROR',
        'UserPreferences',
        'Failed to get userPreferences'
      );
      return;
    }
  };

  static readonly update = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!PreferenceService.isUpdateInputValid(req.body)) {
      sendJsonResponse(
        res,
        'BAD_REQUEST',
        'UserPreferences',
        'Invalid or missing fields'
      );
      return;
    }
    const { id } = req.params;
    if (!assertOwnership(req, res, id)) return;

    try {
      const userPreferences = await prismaNewClient.userPreferences.update({
        where: { userId: id },
        data: req.body,
      });

      if (!userPreferences) {
        sendJsonResponse(
          res,
          'NOT_FOUND',
          'UserPreferences',
          'userPreferences not found'
        );
        return;
      }

      sendJsonResponse(
        res,
        'SUCCESS',
        'UserPreferences',
        'UserPreferences founded',
        'userPreferences',
        userPreferences
      );
    } catch {
      sendJsonResponse(
        res,
        'ERROR',
        'UserPreferences',
        'Failed to update userPreferences'
      );
      return;
    }
  };

  static readonly delete = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    if (!assertOwnership(req, res, id)) return;

    try {
      await prismaNewClient.userPreferences.delete({ where: { userId: id } });
      sendJsonResponse(
        res,
        'SUCCESS',
        'UserPreferences',
        'UserPreferences deleted'
      );
    } catch {
      sendJsonResponse(
        res,
        'ERROR',
        'UserPreferences',
        'Failed to delete userPreferences'
      );
      return;
    }
  };
}
