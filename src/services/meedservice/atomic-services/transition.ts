import { ITransition, ApplicationProgress } from '../../models/meedservice';
import { TransitionRepository } from './../repository/transition-repository';
import { CommonUtils, DbSearchParams } from './../../../utils/common';
import { MemberService } from './member';

export class TransitionService {
  private static transitionRepository = new TransitionRepository();
  constructor() {}

  //#region transition Crud Operations
  /**
   *  Creates a new transition with the parameters that are passed in.
   *
   * @static
   * @param {ITransition} transition
   * @returns {Promise<ITransition>}
   * @transitionof MeedService
   */
  static async create(transition: ITransition): Promise<ITransition> {
    const retVal = await this.transitionRepository.create(transition);
    return retVal;
  }

  /**
   *  Creates a new transition with the parameters that are passed in or ignore if already that is created
   *
   * @static
   * @param {ITransition} transition
   * @returns {Promise<ITransition>}
   * @transitionof MeedService
   */
  static async createOrIgnore(transition: ITransition): Promise<ITransition> {
    try {
      const { bank } = await MemberService.findById(transition.memberId);
      if (bank) {
        transition.bankId = bank;
      }
      const retVal = await this.transitionRepository.create(transition);
      return retVal;
    } catch (error) {
      // We ignored duplicate key error
      if (error.code === 11000) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create multiple transition with the array of transition that are  passed in as parameter
   * or ignore if already have that transition
   *
   * @static
   * @param {ITransition[]} transitions
   * @returns {Promise<ITransition[]>}
   * @memberof TransitionService
   */
  static async createManyOrIgnore(transitions: ITransition[]): Promise<ITransition[]> {
    try {
      const member = await MemberService.findById(transitions[0].memberId);

      if (member?.bank) {
        transitions = transitions.map(transition => {
          transition.bankId = member?.bank;
          return transition;
        });

        if (member?.applicationProgress === ApplicationProgress.BankIdentified) {
          await this.transitionRepository.addBankId(transitions[0]?.memberId, {
            bankId: member?.bank
          });
        }
      }

      if (member?.applicationProgress === ApplicationProgress.BankIdentified) {
        transitions = transitions.filter(transition => transition.status === ApplicationProgress.BankIdentified);
      }

      const retVal = await this.transitionRepository.model.insertMany(transitions);
      return retVal;
    } catch (error) {
      // We ignored duplicate key error
      if (error.code === 11000) {
        return null;
      }
      throw error;
    }
  }

  /**
   *  Finds and returns a transition based on the id.
   *
   * @static
   * @param {string} transitionId
   * @returns {Promise<ITransition>}
   * @transitionof MeedService
   */
  static async findById(transitionId: string): Promise<ITransition> {
    const retVal = await this.transitionRepository.findById(transitionId);
    return retVal as ITransition;
  }

  /**
   *  Finds and returns a transition based on some search criteria, otherwise
   *   returns all transitions
   *
   * @static
   * @param {string} transitionId
   * @returns {Promise<ITransition>}
   * @transitionof MeedService
   */
  static async find(qs: string): Promise<ITransition[]> {
    let search: DbSearchParams = {};

    if (qs) {
      search = CommonUtils.getDbSearchParams(qs);
    }

    return await this.transitionRepository.find(
      search.filter,
      search.projection,
      search.sort,
      search.limit,
      search.skip
    );
  }

  /**
   *  Updates a transition based on the fields that are passed it. It can be one or multiple
   *  fields updated at once.
   *
   * @static
   * @param {string} transitionId
   * @param {ITransition} transition
   * @returns {(Promise<ITransition | null>)}
   * @transitionof MeedService
   */
  static async update(transitionId: string, transition: ITransition): Promise<ITransition | null> {
    // TODO add method documentation to all functions

    // check to see what fields are present on the object to determine business logic to perform
    // on whether to allow the update and under what conditions
    // the object should only contain those fields which are being updated

    const retVal = await this.transitionRepository.findByIdAndUpdate(transitionId, transition);
    return retVal;
  }

  /**
   *  Removes the transition from the database.
   *
   * @static
   * @param {string} transitionId
   * @returns {Promise<boolean>}
   * @transitionof MeedService
   */
  static async deletetransition(transitionId: string): Promise<boolean> {
    const retVal = await this.transitionRepository.delete(transitionId);
    return retVal;
  }
  //#endregion
}
