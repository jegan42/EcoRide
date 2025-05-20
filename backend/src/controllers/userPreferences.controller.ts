// backend/src/controllers/userPreferences.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { PreferenceService } from '../services/userPreferences.service';
import { assertOwnership, requireUser } from '../utils/request';

export class PreferencesController {
  static readonly create = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!PreferenceService.isCreateInputValid(req.body)) {
      res.status(400).json({ message: 'Missing or invalid required fields' });
      return;
    }

    const { id } = req.params;
    if (!assertOwnership(req, res, id)) return;

    try {
      if (await PreferenceService.isExistUserPreferences(id)) {
        res.status(409).json({ message: 'UserPreferences already exists' });
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

      res.status(201).json({ userPreferences });
    } catch {
      res.status(500).json({ message: 'Failed to create userPreferences' });
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
        res.status(404).json({ message: 'userPreferences not found' });
        return;
      }

      res.status(200).json({ userPreferences });
    } catch {
      res.status(500).json({ message: 'Failed to get userPreferences' });
      return;
    }
  };

  static readonly update = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!PreferenceService.isUpdateInputValid(req.body)) {
      res.status(400).json({ message: 'Invalid or missing fields' });
      return;
    }
    const { id } = req.params;
    if (!assertOwnership(req, res, id)) return;

    try {
      const userPreferences = await prismaNewClient.userPreferences.update({
        where: { userId: id },
        data: req.body,
      });

      res.status(200).json({ userPreferences });
    } catch {
      res.status(500).json({ message: 'Failed to update userPreferences' });
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
      res.status(200).json({ message: 'Preferences deleted!' });
    } catch {
      res.status(500).json({ message: 'Failed to delete userPreferences' });
      return;
    }
  };
}
