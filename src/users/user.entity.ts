import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Expense } from '../expenses/expense.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @OneToMany(() => Expense, (expense) => expense.paidBy)
  paidExpenses!: Expense[];

  @OneToMany(() => Expense, (expense) => expense.expenseFor)
  owedExpenses!: Expense[];
}
