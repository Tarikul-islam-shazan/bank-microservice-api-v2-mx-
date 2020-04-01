import { Response } from 'express';
import { MeedRequest } from '../../../interfaces/MeedRequest';
import DIContainer from '../../../utils/ioc/ioc';
import { TYPES } from '../../../utils/ioc/types';
import { ContactService } from '../services/contacts';

class ContactServiceController {
  private static getService(req: MeedRequest): ContactService {
    const service = DIContainer.getNamed<ContactService>(TYPES.ContactService, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
    return service;
  }

  static async addContact(req: MeedRequest, res: Response): Promise<void> {
    const response: any = await ContactServiceController.getService(req).addContact(req.body);
    if (response && response.otpID) {
      res.set('meedbankingclub-otp-id', response.otpID);
      delete response.otpID;
      res.status(403).json({ data: response });
      return;
    }
    res.status(201).json(response);
  }

  static async updateContact(req: MeedRequest, res: Response): Promise<void> {
    const customerId = req.params.id;
    const contactType = req.query.contactType;
    const response = await ContactServiceController.getService(req).updateContact(customerId, contactType, req.body);
    res.status(200).json(response);
  }

  static async deleteContact(req: MeedRequest, res: Response): Promise<void> {
    const id = req.params.id;
    const contactType = req.query.contactType;
    const response = await ContactServiceController.getService(req).deleteContact(id, contactType);
    res.status(200).json(response);
  }

  static async getContacts(req: MeedRequest, res: Response): Promise<void> {
    const memberId = req.get('meedbankingclub-memberid');
    const response = await ContactServiceController.getService(req).getContacts(memberId);
    res.status(200).json({ contacts: response });
  }
}

export default ContactServiceController;
