import { Request, Response } from 'express';
import { SavingsGoalsService } from './service';
import { SendGrid, ISendGridTemplate } from '../../utils/sendgrid/sendGridHelper';

export class SavingsGoalsController {
  public static async getSavingsGoals(req: Request, res: Response): Promise<void> {
    const memberId = req.headers['meedbankingclub-memberid'] as string;
    const response = await SavingsGoalsService.getSavingsGoals(memberId);
    res.status(200).json(response);
  }

  public static async saveSavingsGoals(req: Request, res: Response): Promise<void> {
    const response = await SavingsGoalsService.saveSavingsGoals(req.body);
    res.status(200).json(response);
  }

  public static async updateSavingsGoals(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const response = await SavingsGoalsService.updateSavingsGoals(id, req.body);
    res.status(200).json(response);
  }

  public static async deleteSavingsGoals(req: Request, res: Response): Promise<void> {
    const memberId = req.headers['meedbankingclub-memberid'] as string;
    const id = req.params.id;
    await SavingsGoalsService.deleteSavingsGoals(memberId, id);
    res.status(204).json();
  }
}
