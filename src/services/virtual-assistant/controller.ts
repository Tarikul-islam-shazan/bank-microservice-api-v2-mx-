import { Response, NextFunction } from 'express';
import { MeedRequest } from '../../interfaces/MeedRequest';
import { VirtualAssistantService } from './service';
import { IVAData, IVADTree, IChatHistory, IChatSession } from '../models/virtual-assistant/interface';

class VirtualAssistantController {
  /**
   * Initialize Virtual Assistant
   * @static
   * @param {MeedRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   * @memberof VirtualAssistantController
   */
  public static async initialize(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const retData: any = await VirtualAssistantService.initialize(req.query.language);
    res.json(retData);
  }

  /**
   * Chat/Get help from virtual assistant. If recognitionId and answerId exists in body
   * then it is a FAQ type query, other wise general query
   *
   * @static
   * @param {MeedRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   * @memberof VirtualAssistantController
   */
  public static async chat(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const retData: any = await VirtualAssistantService.chat(req.body as IVAData);
    res.json(retData);
  }

  /**
   * @static
   * @param {MeedRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   * @memberof VirtualAssistantController
   */
  public static async getAutosuggestion(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const retData: any = await VirtualAssistantService.getAutosuggestion(req.query as IVAData);
    res.json(retData);
  }

  /**
   * @static
   * @param {MeedRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   * @memberof VirtualAssistantController
   */
  public static async submitAutosuggestion(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const retData: any = await VirtualAssistantService.submitAutosuggestion(req.body as IVAData);
    res.json(retData);
  }

  /**
   * @static
   * @param {MeedRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   * @memberof VirtualAssistantController
   */
  public static async submitDialogueTree(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const retData: any = await VirtualAssistantService.submitDialogueTree(req.body as IVADTree);
    res.json(retData);
  }

  /**
   * @static
   * @param {MeedRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   * @memberof VirtualAssistantController
   */
  public static async createLiveChatSession(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const retData: any = await VirtualAssistantService.createLiveChatSession(req.body as IChatSession);
    res.json(retData);
  }

  /**
   * @static
   * @param {MeedRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   * @memberof VirtualAssistantController
   */
  public static async saveChatHistory(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const retData: any = await VirtualAssistantService.saveChatHistory(req.body as IChatHistory);
    res.json(retData);
  }
}

export default VirtualAssistantController;
