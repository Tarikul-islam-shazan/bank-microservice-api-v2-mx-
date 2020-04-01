import { Request, Response, NextFunction } from 'express';
import { MeedService } from '../../service';
import { IInvitation } from '../../../models/meedservice';
import { MeedRequest } from '../../../../interfaces/MeedRequest';

export class MobileBFFController {
  public static async getStaticData(req: Request, res: Response, next: NextFunction): Promise<any> {
    const query = req.query;
    const member = await MeedService.getStaticData(query);
    res.status(201).json({ data: member });
  }

  //#region Invitation
  /**
   * Changed response to remove "invited" wrapper from response
   * now returning array
   * @param req
   * @param res
   */
  public static async list(req: MeedRequest, res: Response): Promise<void> {
    const memberId = req.get('meedbankingclub-memberid');
    const data = await MeedService.getInvitationList(memberId);
    res.status(200).json(data);
  }

  /**
   * @param req
   * @param res
   */
  public static async invite(req: MeedRequest, res: Response): Promise<void> {
    const invitations: IInvitation[] = req.body;
    const inviter = req.headers['meedbankingclub-memberid'] as string;
    const data = await MeedService.sendInvitation(inviter, invitations);
    res.status(200).json(data);
  }

  static async verify(req: MeedRequest, res: Response): Promise<void> {
    const response = await MeedService.verifyInvitees(req.body);
    res.json(response);
  }
  //#endregion

  //#region UILogger
  public static async UILogger(req: MeedRequest, res: Response): Promise<void> {
    const logData: any = req.body;
    MeedService.UILogger(logData);
    res.end();
  }
  //#endregion
}
