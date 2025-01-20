"use client";

// Imports
import Card from "@/components/dashboard/card";
import {
  complaintsData,
  accountantDashboardCardData,
  invoiceTableFields,
  dashboardInvoiceTableData,
} from './data';
import WalletBalanceCard from "@/components/dashboard/wallet-balance";
import NotificationCard from "@/components/dashboard/notification-card";
import { DashboardChart } from "@/components/dashboard/chart";
import DashboarddCalendar from "@/components/dashboard/Dashcalendar";
import { SectionContainer } from "@/components/Section/section-components";
import { TaskCard } from "@/components/dashboard/kanban/TaskCard";
import CustomTable from "@/components/Table/table";
import Link from "next/link";
import { useWalletStore } from "@/store/wallet-store";
import clsx from "clsx";
import { useRole } from "@/hooks/roleContext";

const Dashboard = () => {
    const { role, setRole } = useRole();

  const walletId = useWalletStore((state) => state.walletId);
  const recentTransactions = useWalletStore(
    (state) => state.recentTransactions
  );
  const transactions = useWalletStore((state) => state.transactions);

  const dashboardPerformanceChartData = transactions.map((t) => ({
    date: t.date,
    totalfunds: t.amount,
    credit: t.type === "credit" ? t.amount : 0,
    debit: t.type === "debit" ? t.amount : 0,
  }));

  // console.log("transactions", transactions)


  return (
    <section className='custom-flex-col gap-10'>
      <div className='w-full h-full flex flex-col xl:flex-row gap-x-10 gap-y-6'>
        <div className='w-full xl:flex-1 space-y- xl:space-y-2'>
          <div className='w-full flex py-1.5 xl:py-1 overflow-x-auto md:overflow-hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 no-scrollbar'>
            {accountantDashboardCardData.map((card, index) => (
              <Link
                href={card.link}
                key={index}
                prefetch={false}
                className={clsx({
                  'lg:mt-6': index >= accountantDashboardCardData.length - 3
                })}
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
          <DashboarddCalendar />
        </div>
      </div>

      <SectionContainer
        heading='Recent invoice'
        href='/accounting/invoice'
      >
        <CustomTable
          data={dashboardInvoiceTableData}
          fields={invoiceTableFields}
          tableHeadClassName='h-[76px]'
          tableBodyCellSx={{
            fontSize: '1rem',
            paddingTop: '18px',
            paddingBottom: '18px',
          }}
          tableHeadCellSx={{ fontSize: '1rem' }}
        />
      </SectionContainer>
      <SectionContainer
        heading='Recent Complains'
        href='/tasks/complaints'
      >
        <div className='bg-white dark:bg-[#3C3D37] p-6 border-2 border-dashed rounded-lg border-gray-300 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <TaskCard
                statusChanger={false}
                noDrag
                isNew
                key={index}
                task={{
                  id: 'task9',
                  columnId: 'approved',
                  content: {
                    messageCount: 2,
                    linkCount: 1,
                    userAvatars: [
                      '/empty/avatar.png',
                      '/empty/avatar.png',
                      '/empty/avatar.png',
                    ],
                    date: '25 Jan 2024',
                    status: 'pending',
                    progress: 50,
                  },
                  name: 'John Doe',
                  title: 'Project Manager',
                  message:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                  avatarSrc: '/empty/avatar.png',
                }}
              />
            ))}
        </div>
      </SectionContainer>
    </section>
  );
};

export default Dashboard;
