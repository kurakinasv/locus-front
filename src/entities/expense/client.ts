import { ExpenseStatus, SplitMethod } from 'config/expenses';
import { ExpenseCategory } from 'entities/expenseCategory';
import { Group } from 'entities/group';
import { GroupMemberClient } from 'entities/groupMember';
import { User } from 'entities/user';
import { DateString, DefaultId } from 'typings/api';

export type ExpenseClient = {
  id: DefaultId;
  name: string;
  amount: number;
  currency: string;
  description: string | null;
  purchaseDate: DateString;
  splitMethod: SplitMethod;
  expenseStatus: ExpenseStatus;
  createdBy: User['id'];
  groupId: Group['id'];
  categoryId: ExpenseCategory['id'] | null;
  category: ExpenseCategory | null;
  userGroupIds: GroupMemberClient['id'][];
};

export type ExpenseWithDebt = ExpenseClient & {
  debtAmount: number;
};
