'use client';

// Imports
import Card from '@/components/dashboard/card';
import {
  complaintsData,
  dashboardCardData,
  dashboardListingsChartConfig,
  dashboardListingsChartData,
  dashboardPerformanceChartConfig,
  dashboardPerformanceChartData,
  recentMessagesData,
  walletBalanceCardData,
  invoiceTableFields,
  dashboardInvoiceTableData,
  userDashboardCardData,
  recentTransactionTableFields,
  recentTransactions,
} from './data';
import WalletBalanceCard from '@/components/dashboard/wallet-balance';
import { DashboardChart } from '@/components/dashboard/chart';
import { SectionContainer } from '@/components/Section/section-components';
import { TaskCard } from '@/components/dashboard/kanban/TaskCard';
import CustomTable from '@/components/Table/table';
import Link from 'next/link';
import { useWalletStore } from '@/store/wallet-store';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { getTransactionIcon } from '@/components/Wallet/icons';
import { KanbanBoard } from '@/components/dashboard/kanban/KanbanBoard';

const Dashboard = () => {
  const walletId = useWalletStore((state) => state.walletId);
  // const recentTransactions = useWalletStore(
  //   (state) => state.recentTransactions
  // );
  const transactions = useWalletStore((state) => state.transactions);

  const dashboardPerformanceChartData = transactions.map((t) => ({
    date: t.date,
    totalfunds: t.amount,
    credit: t.type === 'credit' ? t.amount : 0,
    debit: t.type === 'debit' ? t.amount : 0,
  }));

  //TODO: use transactions from API 
  const transformedWalletTableData = recentTransactions.map((t) => ({
    ...t,
    amount: (
      <span
        className={clsx({
          'text-status-success-3': t.type === 'credit',
          'text-status-error-primary': t.type === 'debit',
        })}
      >
        {`${t.type === 'credit' ? '+' : t.type === 'debit' ? '-' : ''}${
          t.amount
        }`}
      </span>
    ),
    icon: (
      <div
        className={clsx(
          'flex items-center justify-center w-9 h-9 rounded-full',
          {
            'bg-status-error-1 text-status-error-primary': t.type === 'debit',
            'bg-status-success-1 text-status-success-primary':
              t.type === 'credit' || t.type === 'DVA',
          }
        )}
      >
        {/* {getTransactionIcon(t.source, t.transaction_type)} */}
      </div>
    ),
  }));

  console.log('transactions', transactions);

  return (
    <section className='custom-flex-col gap-10'>
      <div className='w-full h-full flex flex-col xl:flex-row gap-x-10 gap-y-6'>
        <div className='w-full xl:flex-1 space-y-4 xl:space-y-6'>
          <div className='w-full flex py-1.5 xl:py-7 overflow-x-auto md:overflow-hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 no-scrollbar'>
            {userDashboardCardData.map((card, index) => (
              <Link
                href={card.link}
                key={index}
                prefetch={false}
              >
                <Card
                  title={card.title}
                  icon={<card.icon />}
                  value={card.value}
                  subvalue={card.subValue}
                  bg={card.bg}
                />
              </Link>
            ))}
          </div>
        </div>

        <div className='w-full xl:w-[30%] xl:max-w-[342px] h-full grid md:grid-cols-2 xl:grid-cols-1 gap-6'>
          <WalletBalanceCard />
        </div>
      </div>

      <SectionContainer
        heading='Recent Transaction'
        href='/user/dashboard/transactions'
      >
        <CustomTable
          data={transformedWalletTableData}
          fields={recentTransactionTableFields}
          tableHeadClassName='h-[76px]'
          tableBodyCellSx={{
            fontSize: '1rem',
            paddingTop: '18px',
            paddingBottom: '18px',
          }}
          tableHeadCellSx={{ fontSize: '1rem' }}
        />
      </SectionContainer>

      <SectionContainer heading='Complaints'>
        <KanbanBoard />
      </SectionContainer>
    </section>
  );
};

export default Dashboard;
