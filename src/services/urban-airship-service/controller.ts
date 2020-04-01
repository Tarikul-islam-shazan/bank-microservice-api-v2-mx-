import { Request, Response } from 'express';

import DIContainer from '../../utils/ioc/ioc';
import { TYPES } from '../../utils/ioc/types';

import {
  IUASAssociateEmailToNamedUserId,
  IUASRegEmail,
  IUASUpdateEmail,
  IUrbanAirshipService
} from '../models/urban-airship/interface';

class UrbanAirshipServiceController {
  /**
   * Create a new email channel or update an existing channel.
   * If you provide the email address of an existing channel, the call is treated as a PUT.
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>} { ok: boolean, channel_id: string }
   * @memberof UrbanAirshipServiceController
   */
  public static async registerEmailAddress(req: Request, res: Response): Promise<any> {
    const channel: IUASRegEmail = req.body;
    const response = await DIContainer.get<IUrbanAirshipService>(TYPES.UrbanAirshipService).uasRegisterEmailAddress(
      channel
    );
    return res.status(200).json(response);
  }

  /**
   * Update an email channel. You can use this endpoint to update
   * the email address associated with a channel.
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>} { ok: boolean, channel_id: string }
   * @memberof UrbanAirshipServiceController
   */
  public static async updateEmailChannel(req: Request, res: Response): Promise<any> {
    const channel: IUASUpdateEmail = req.body.channel;
    const response = await DIContainer.get<IUrbanAirshipService>(TYPES.UrbanAirshipService).uasUpdateEmailChannel(
      channel
    );
    return res.status(200).json(response);
  }

  /**
   * Associate a channel or email address with a named user (named_user_id).
   * If the named_user_id does not already exist, this operation will create it.
   * If the channel_id or email address is already associated with the named_user_id, this operation will do nothing.
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>} { ok: boolean }
   * @memberof UrbanAirshipServiceController
   */
  public static async associateEmailToNamedUserId(req: Request, res: Response): Promise<any> {
    const associatePayload: IUASAssociateEmailToNamedUserId = req.body;
    const response = await DIContainer.get<IUrbanAirshipService>(
      TYPES.UrbanAirshipService
    ).uasAssociateEmailToNamedUserId(associatePayload);
    return res.status(200).json(response);
  }

  /**
   * Return a list of named users or lookup a single named user by (namedUser).
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>} { ['meed_push', 'meed_email'] }
   * @memberof UrbanAirshipServiceController
   */
  public static async namedUserLookup(req: Request, res: Response): Promise<any> {
    const { namedUser } = req.query;
    const response = await DIContainer.get<IUrbanAirshipService>(TYPES.UrbanAirshipService).uasNamedUserLookup(
      namedUser
    );
    return res.status(200).json(response);
  }

  /**
   * Set initial tags for a single email channel / named user.
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>} { ok: boolean }
   * @memberof UrbanAirshipServiceController
   */
  public static async addInitialTags(req: Request, res: Response): Promise<any> {
    const { namedUser, banks } = req.body;
    const response = await DIContainer.get<IUrbanAirshipService>(TYPES.UrbanAirshipService).uasAddInitialTags({
      namedUser,
      banks
    });
    return res.status(200).json(response);
  }

  /**
   * Add a tag for a single email channel.
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>} { ok: boolean }
   * @memberof UrbanAirshipServiceController
   */
  public static async addTag(req: Request, res: Response): Promise<any> {
    const { namedUser, tag } = req.body;
    const response = await DIContainer.get<IUrbanAirshipService>(TYPES.UrbanAirshipService).uasAddTag({
      namedUser,
      tag
    });
    return res.status(200).json(response);
  }

  /**
   * Remove a tag for a single email channel.
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>} { ok: boolean }
   * @memberof UrbanAirshipServiceController
   */
  public static async removeTag(req: Request, res: Response): Promise<any> {
    const { namedUser, tag } = req.body;
    const response = await DIContainer.get<IUrbanAirshipService>(TYPES.UrbanAirshipService).uasRemoveTag({
      namedUser,
      tag
    });
    return res.status(200).json(response);
  }
}

export default UrbanAirshipServiceController;
