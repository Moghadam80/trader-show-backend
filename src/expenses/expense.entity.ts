import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.paidExpenses, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'paidById' })
  paidBy!: User;

  @ManyToOne(() => User, (user) => user.owedExpenses, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'expenseForId' })
  expenseFor!: User;

  @Column('decimal', { precision: 12, scale: 2 })
  amount!: number;

  @Column({ length: 120 })
  description!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
