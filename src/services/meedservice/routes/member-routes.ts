import { MemberController } from './../controllers/member-controller';
import { asyncWrapper } from '../../../middleware/asyncWrapper';
import AuthMiddleware from '../../../middleware/authMiddleware';
import handleValidation from '../../../middleware/validator';
import { UpdateLanguage, VerifyMember } from '../validators/member/validator';

export const memberRoutes = [
  // TODO: add validation for updating member
  // TODO: all of these routes are accessible from outside of orchestration
  // so they will require MeedAuthorization
  {
    path: 'v1.0.0/meed/members/',
    method: 'get',
    handler: [asyncWrapper(MemberController.findMembers)]
  },
  {
    path: 'v1.0.0/meed/members/',
    method: 'post',
    handler: [asyncWrapper(MemberController.createMember)]
  },
  {
    path: 'v1.0.0/meed/members/verify',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(VerifyMember),
      asyncWrapper(MemberController.verifyMember)
    ]
  },
  {
    path: 'v1.0.0/meed/members/:id',
    method: 'get',
    handler: [asyncWrapper(MemberController.findMemberById)]
  },
  {
    path: 'v1.0.0/meed/members/:id',
    method: 'patch',
    handler: [asyncWrapper(MemberController.updateMember)]
  },
  {
    path: 'v1.0.0/meed/members/:id',
    method: 'delete',
    handler: [asyncWrapper(MemberController.deleteMember)]
  },
  {
    path: 'v1.0.0/meed/members/:id/language',
    method: 'patch',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(UpdateLanguage),
      asyncWrapper(MemberController.updateLanguage)
    ]
  }
];
