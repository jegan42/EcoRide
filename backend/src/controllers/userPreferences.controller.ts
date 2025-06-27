// backend/src/controllers/userPreferences.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import {
  badRequestResponse,
  conflictResponse,
  errorResponse,
  notFoundResponse,
  successCreateResponse,
  successResponse,
} from '../utils/response';
import { User } from '../../generated/prisma';

export class PreferencesController {
  static readonly create = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const user = req.user as User;

    try {
      const existUserPreferences =
        await prismaNewClient.userPreferences.findUnique({
          where: { userId: user.id },
        });
      if (existUserPreferences) {
        conflictResponse(
          res,
          'UserPreferences',
          'already created userPreferences'
        );
        return;
      }

      const { acceptsSmoker, acceptsPets, acceptsMusic, acceptsChatter } =
        req.body;

      const userPreferences = await prismaNewClient.userPreferences.create({
        data: {
          userId: user.id,
          acceptsSmoker,
          acceptsPets,
          acceptsMusic,
          acceptsChatter,
        },
      });

      successCreateResponse(res, 'UserPreferences', 'created', userPreferences);
    } catch (error) {
      errorResponse(res, 'UserPreferences', 'failed to create', error);
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

    try {
      const userPreferences = await prismaNewClient.userPreferences.findUnique({
        where: { userId: id },
      });
      if (!userPreferences) {
        notFoundResponse(res, 'UserPreferences', 'userPreferences not found');
        return;
      }

      successResponse(res, 'UserPreferences', 'getByUserId', userPreferences);
    } catch (error) {
      errorResponse(res, 'UserPreferences', 'failed to getByUserId', error);
    }
  };

  static readonly update = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const user = req.user as User;

    if (Object.keys(req.body).length < 1) {
      badRequestResponse(res, 'UserPreferences', 'missing fields');
      return;
    }

    try {
      const userPreferences = await prismaNewClient.userPreferences.update({
        where: { userId: user.id },
        data: req.body,
      });

      successResponse(res, 'UserPreferences', 'updated', userPreferences);
    } catch (error) {
      errorResponse(res, 'UserPreferences', 'failed to update', error);
    }
  };

  static readonly delete = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const user = req.user as User;

    try {
      await prismaNewClient.userPreferences.delete({
        where: { userId: user.id },
      });
      successResponse(res, 'UserPreferences', 'deleted');
    } catch (error) {
      errorResponse(res, 'UserPreferences', 'failed to delete', error);
    }
  };
}
