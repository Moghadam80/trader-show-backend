import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './create-expense.dto';
import { Expense } from './expense.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense) private readonly expenses: Repository<Expense>,
    private readonly usersService: UsersService,
  ) {}

  findAll() {
    return this.expenses.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateExpenseDto) {
    if (dto.paidById === dto.expenseForId) {
      throw new BadRequestException('Paid by and expense for must be different people.');
    }
    const [paidBy, expenseFor] = await Promise.all([
      this.usersService.findById(dto.paidById),
      this.usersService.findById(dto.expenseForId),
    ]);
    if (!paidBy || !expenseFor) throw new NotFoundException('One or more users were not found.');
    return this.expenses.save(this.expenses.create({ ...dto, paidBy, expenseFor }));
  }

  async balances() {
    const expenses = await this.expenses.find();
    const totals = new Map<string, { from: string; to: string; amount: number }>();
    for (const expense of expenses) {
      const key = [expense.paidBy.id, expense.expenseFor.id].sort().join(':');
      const current = totals.get(key) ?? { from: expense.paidBy.id, to: expense.expenseFor.id, amount: 0 };
      if (current.from === expense.paidBy.id) current.amount += Number(expense.amount);
      else current.amount -= Number(expense.amount);
      totals.set(key, current);
    }

    const users = await this.usersService.findAll();
    const byId = new Map(users.map((user) => [user.id, user]));
    return [...totals.values()]
      .filter((item) => Math.abs(item.amount) > 0.004)
      .map((item) => {
        const positive = item.amount > 0;
        const creditorId = positive ? item.from : item.to;
        const debtorId = positive ? item.to : item.from;
        return {
          creditor: byId.get(creditorId),
          debtor: byId.get(debtorId),
          amount: Number(Math.abs(item.amount).toFixed(2)),
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }
}
