// backend/src/controllers/userPreferences.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { assertOwnership } from '../utils/request';
import { sendJsonResponse } from '../utils/response';
import { User } from '../../generated/prisma';

export class PreferencesController {
  static readonly create = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    if (!assertOwnership(req, res, id)) return;

    try {
      const existUserPreferences =
        await prismaNewClient.userPreferences.findUnique({
          where: { userId: id },
        });
      if (existUserPreferences) {
        sendJsonResponse(
          res,
          'CONFLICT',
          'UserPreferences',
          'already created userPreferences'
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

      sendJsonResponse(
        res,
        'SUCCESS_CREATE',
        'UserPreferences',
        'created',
        'userPreferences',
        userPreferences
      );
    } catch {
      sendJsonResponse(res, 'ERROR', 'UserPreferences', 'failed to create');
    }
  };

  static readonly getUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const user = req.user as User;

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
        'getByUserId',
        'userPreferences',
        userPreferences
      );
    } catch {
      sendJsonResponse(
        res,
        'ERROR',
        'UserPreferences',
        'failed to getByUserId'
      );
    }
  };

  static readonly update = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    if (!assertOwnership(req, res, id)) return;

    if (Object.keys(req.body).length < 1) {
      sendJsonResponse(res, 'BAD_REQUEST', 'UserPreferences', 'missing fields');
      return;
    }

    try {
      const userPreferences = await prismaNewClient.userPreferences.update({
        where: { userId: id },
        data: req.body,
      });

      sendJsonResponse(
        res,
        'SUCCESS',
        'UserPreferences',
        'updated',
        'userPreferences',
        userPreferences
      );
    } catch {
      sendJsonResponse(res, 'ERROR', 'UserPreferences', 'failed to update');
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
      sendJsonResponse(res, 'SUCCESS', 'UserPreferences', 'deleted');
    } catch {
      sendJsonResponse(res, 'ERROR', 'UserPreferences', 'failed to delete');
    }
  };
}
