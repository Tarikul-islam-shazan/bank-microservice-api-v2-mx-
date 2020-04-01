import request from 'supertest';
jest.mock('@sendgrid/client');
const Client = require('@sendgrid/client');

import config from '../../../../config/config';
import app from '../../../../app';
import { InvitationService } from '../../atomic-services/invitation';
import { InvitationRepository } from '../../repository/invitation-repository';
import { MemberService } from '../../atomic-services/member';
import { mockSendInvite, mockMember, mockInvitation, mockSendgridError } from './mocks/mock-data';
import { BankIdentifier } from '../../../../interfaces/MeedRequest';
import { MemberModel } from '../../models/member';
import { InvitationModel } from '../../models/invitation';
import { Database } from '../../../../utils/database';

jest.mock('../../../../middleware/authMiddleware');

describe('Invitation Service', () => {
  jest.setTimeout(5000);

  beforeEach(() => {
    Client.request.mockClear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('Send invitation', () => {
    let spyInivation;

    beforeAll(() => {
      spyInivation = jest.spyOn(InvitationService, 'send');
    });

    afterAll(() => {
      spyInivation.mockRestore();
    });

    describe('validation should return 400 when', () => {
      let spyMemberService;

      beforeAll(() => {
        spyMemberService = jest.spyOn(MemberService, 'findById');
        spyMemberService.mockImplementation(() => Promise.resolve(mockMember)).mockResolvedValue(mockMember);
      });

      afterAll(() => {
        spyMemberService.mockRestore();
      });

      for (const key of Object.keys(mockSendInvite)) {
        const { [key]: omitted, ...missingProp } = mockSendInvite as any;
        it(`invitation has no ${key}`, async () => {
          const response = await request(app)
            .post(`${config.app.baseUrl}v1.0.0/invitations`)
            .send([missingProp])
            .set('Content-Type', 'application/json')
            .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

          expect(spyInivation).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.body).toHaveProperty('code');
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toEqual(`"[0].${key}" is required`);
        });
      }
    });

    describe('Mock database', () => {
      let spyRepository;
      let spyModel;
      let spyMemberService;

      beforeEach(() => {
        spyMemberService = jest.spyOn(MemberService, 'findById');
        spyRepository = jest.spyOn(InvitationRepository.prototype, 'create');
        spyModel = jest.spyOn(InvitationModel, 'create');
        spyRepository.mockImplementation(() => Promise.resolve([mockInvitation])).mockResolvedValue([mockInvitation]);
        spyModel.mockImplementation(() => Promise.resolve([mockInvitation])).mockResolvedValue([mockInvitation]);
        spyMemberService.mockImplementation(() => Promise.resolve(mockMember)).mockResolvedValue(mockMember);
      });

      afterEach(() => {
        spyRepository.mockRestore();
        spyModel.mockRestore();
        spyMemberService.mockRestore();
      });

      it('Should create new invitation and send email', async () => {
        const response = await request(app)
          .post(`${config.app.baseUrl}v1.0.0/invitations`)
          .send([mockSendInvite])
          .set('Content-Type', 'application/json')
          .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme)
          .set('meedbankingclub-memberid', mockMember.id);

        expect(response.status).toBe(200);
        expect(spyMemberService).toBeCalledWith(mockMember.id);
        expect(spyModel).toBeCalledTimes(1);
        expect(Client.request).toBeCalledTimes(1);
        expect(response.body).toBeArrayOfSize(1);
      });

      it('Should throw error when send email failed', async () => {
        Client.request.mockImplementation(() => Promise.reject('mock error sendgrid'));

        const response = await request(app)
          .post(`${config.app.baseUrl}v1.0.0/invitations`)
          .send([mockSendInvite])
          .set('Content-Type', 'application/json')
          .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme)
          .set('meedbankingclub-memberid', mockMember.id);

        expect(response.status).toBe(500);
        expect(spyMemberService).toBeCalledWith(mockMember.id);
        expect(spyModel).toBeCalledTimes(1);
        expect(Client.request).toBeCalledTimes(1);

        Client.request.mockImplementation(() => Promise.resolve({}));
      });
    });
  });

  describe('Get invitation list', () => {
    let spyInivation;
    let spyRepository;

    beforeAll(() => {
      spyInivation = jest.spyOn(InvitationService, 'list');
    });

    afterAll(() => {
      spyInivation.mockRestore();
    });

    beforeEach(() => {
      spyRepository = jest.spyOn(InvitationRepository.prototype, 'find');
      spyRepository.mockImplementation(() => Promise.resolve([mockInvitation]));
    });

    afterEach(() => {
      spyRepository.mockRestore();
    });

    it('Should return 400 memberId is missing', async () => {
      const response = await request(app)
        .get(`${config.app.baseUrl}v1.0.0/invitations`)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(400);
      expect(spyInivation).not.toBeCalled();
      expect(spyRepository).not.toBeCalled();
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"meedbankingclub-memberid" is required');
    });

    it('Should return invitation list', async () => {
      const response = await request(app)
        .get(`${config.app.baseUrl}v1.0.0/invitations?memberId=${mockMember.id}`)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme)
        .set('meedbankingclub-memberid', mockMember.id);

      expect(response.status).toBe(200);
      expect(spyInivation).toBeCalled();
      expect(spyRepository).toBeCalled();
      expect(response.body).toBeArray();
      expect(response.body[0]).toMatchObject(mockInvitation);
    });
  });
});
