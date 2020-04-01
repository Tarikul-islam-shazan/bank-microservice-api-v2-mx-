import { BaseRepository } from './repository';
import { ContactModel } from '../models/contacts';
import { IContact, IMeedContact } from '../../models/p2p-service/contacts';

export class ContactRepository extends BaseRepository<IMeedContact, ContactModel> {
  constructor() {
    super(ContactModel);
  }

  async addContact(memberId: string, email: string): Promise<IContact> {
    const contact = await this.create({
      belongTo: memberId,
      email
    });
    return contact;
  }

  async getContacts(memberId: string): Promise<IContact[]> {
    const contacts = await this.find({ belongTo: memberId }, ['email', 'contactType']);
    return contacts;
  }

  async updateContact(contactId: string, updatedData: IMeedContact): Promise<IContact> {
    const updated = await this.findByIdAndUpdate(contactId, updatedData);
    return updated;
  }

  async deleteContact(contactId: string): Promise<IContact> {
    const deleted = await this.model.findByIdAndDelete(contactId);
    return deleted;
  }
}
