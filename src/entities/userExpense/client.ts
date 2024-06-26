import { UserExpenseStatus } from 'config/expenses';
import { ExpenseClient } from 'entities/expense';
import { GroupMemberClient } from 'entities/groupMember';
import { DefaultId } from 'typings/api';

export type UserExpense = {
  id: DefaultId;
  status: UserExpenseStatus;
  personalAmount: number;
  debtAmount: number;
  userGroupId: GroupMemberClient['id'];
  expenseId: ExpenseClient['id'];
};
