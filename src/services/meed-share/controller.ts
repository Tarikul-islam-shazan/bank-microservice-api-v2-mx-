import { Request, Response, NextFunction } from 'express';
import { MeedShareService } from './service';

class MeedShareController {
  public static async getMeedShareStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { memberId } = req.query;
    const response = await MeedShareService.getLatest(memberId);
    res.status(200).json(response);
  }
}

export default MeedShareController;
