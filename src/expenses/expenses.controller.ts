import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateExpenseDto } from './create-expense.dto';
import { ExpensesService } from './expenses.service';

@ApiTags('Expenses')
@Controller()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get('expenses')
  @ApiOperation({ summary: 'List expenses from newest to oldest' })
  findAll() {
    return this.expensesService.findAll();
  }

  @Post('expenses')
  @ApiOperation({ summary: 'Create a directional expense' })
  create(@Body() dto: CreateExpenseDto) {
    return this.expensesService.create(dto);
  }

  @Get('balances')
  @ApiOperation({ summary: 'Get net balances between users' })
  balances() {
    return this.expensesService.balances();
  }
}
