import { Request, Response, NextFunction } from 'express';
import { MemberService } from '../atomic-services/member';

export class MemberController {
  //#region Member
  public static async createMember(req: Request, res: Response, next: NextFunction): Promise<any> {}

  public static async updateMember(req: Request, res: Response, next: NextFunction): Promise<any> {}

  public static async deleteMember(req: Request, res: Response, next: NextFunction): Promise<any> {}

  public static async findMembers(req: Request, res: Response, next: NextFunction): Promise<any> {}

  public static async findMemberById(req: Request, res: Response, next: NextFunction): Promise<any> {}

  public static async updateLanguage(req: Request, res: Response, next: NextFunction): Promise<any> {
    const response = await MemberService.updateLanguage(req.params.id, req.body.language);
    res.json(response);
  }

  public static async verifyMember(req: Request, res: Response, next: NextFunction): Promise<any> {
    const members = await MemberService.verifyMember(req.body as string[]);
    res.json(members);
  }
  //#endregion
}
