import { UserExpenseStatus } from 'config/expenses';
import { ExpenseClient } from 'entities/expense';
import { GroupMemberClient } from 'entities/groupMember';
import { DefaultId } from 'typings/api';

export type UserExpenseServer = {
  id: DefaultId;
  status: UserExpenseStatus;
  debtAmount: number;
  userGroupId: GroupMemberClient['id'];
  expenseId: ExpenseClient['id'];
};
