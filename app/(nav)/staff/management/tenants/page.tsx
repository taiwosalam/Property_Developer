'use client';

// Imports
import { useEffect, useState } from 'react';
import Button from '@/components/Form/Button/button';
import TenantCard from '@/components/Management/landlord-and-tenant-card';
import { Modal, ModalContent, ModalTrigger } from '@/components/Modal/modal';
import ManagementStatistcsCard from '@/components/Management/ManagementStatistcsCard';
import CustomTable from '@/components/Table/table';
import Pagination from '@/components/Pagination/pagination';
import UserTag from '@/components/Tags/user-tag';
import AddTenantModal from '@/components/Management/Tenants/add-tenant-modal';
import BadgeIcon from '@/components/BadgeIcon/badge-icon';
import { getAllStates } from '@/utils/states';
import {
  defaultTenantPageData,
  tenantTableFields,
  type TenantApiResponse,
  type TenantPageData,
  type TenantRequestParams,
  transformTenantApiResponse,
} from './data';
import Link from 'next/link';
import AutoResizingGrid from '@/components/AutoResizingGrid/AutoResizingGrid';
import FilterBar from '@/components/FIlterBar/FilterBar';
import CustomLoader from '@/components/Loader/CustomLoader';
import useView from '@/hooks/useView';
import useFetch from '@/hooks/useFetch';
import useRefetchOnEvent from '@/hooks/useRefetchOnEvent';
import NetworkError from '@/components/Error/NetworkError';
import EmptyList from '@/components/EmptyList/Empty-List';
import { ExclamationMark } from '@/public/icons/icons';
import TableLoading from '@/components/Loader/TableLoading';
import CardsLoading from '@/components/Loader/CardsLoading';
import { AxiosRequestConfig } from 'axios';
import type { FilterResult } from '@/components/Management/Landlord/types';
import dayjs from 'dayjs';
import { AllBranchesResponse } from '@/components/Management/Properties/types';

const states = getAllStates();

const Tenants = () => {
  const storedView = useView();
  const [view, setView] = useState<string | null>(storedView);
  const [pageData, setPageData] = useState<TenantPageData>(
    defaultTenantPageData
  );
  const {
    total_pages,
    current_page,
    total_tenants,
    new_tenants_this_month,
    mobile_tenants,
    new_mobile_tenants_this_month,
    web_tenants,
    new_web_tenants_this_month,
    tenants,
  } = pageData;

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: '',
    } as TenantRequestParams,
  });

  const { data: branchesData } =
    useFetch<AllBranchesResponse>('/branches/select');

  const branchOptions =
    branchesData?.data.map((branch) => ({
      label: branch.branch_name,
      value: branch.id,
    })) || [];

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const isFilterApplied = () => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  };

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate } = filters;
    const statesArray = menuOptions['State'] || [];
    const agent = menuOptions['Tenant Type']?.[0];
    const branchIdsArray = menuOptions['Branch'] || [];

    const queryParams: TenantRequestParams = {
      page: 1,
      search: '',
    };
    if (statesArray.length > 0) {
      queryParams.states = statesArray.join(',');
    }
    if (branchIdsArray.length > 0) {
      queryParams.branch_ids = branchIdsArray.join(',');
    }
    if (agent && agent !== 'all') {
      queryParams.agent = agent;
    }
    if (startDate) {
      queryParams.start_date = dayjs(startDate).format('YYYY-MM-DD');
    }
    if (endDate) {
      queryParams.end_date = dayjs(endDate).format('YYYY-MM-DD');
    }
    setConfig({
      params: queryParams,
    });
  };

  const handlePageChange = (page: number) => {
    setConfig({
      params: { ...config.params, page },
    });
  };

  const handleSearch = async (query: string) =>
    setConfig({
      params: { ...config.params, search: query },
    });

  const handleSort = (order: 'asc' | 'desc') => {
    setConfig({
      params: { ...config.params, sort_order: order },
    });
  };

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<TenantApiResponse>('tenants', config);

  useEffect(() => {
    if (apiData) {
      setPageData((x) => ({
        ...x,
        ...transformTenantApiResponse(apiData),
      }));
    }
  }, [apiData]);

  // Listen for the refetch event
  useRefetchOnEvent('refetchTenants', () => refetch({ silent: true }));

  const transformedTenants = tenants.map((t) => ({
    ...t,
    full_name: (
      <p className='flex items-center whitespace-nowrap'>
        <span>{t.name}</span>
        {t.badge_color && <BadgeIcon color={t.badge_color} />}
      </p>
    ),
    user_tag: <UserTag type={t.user_tag} />,
    'manage/chat': (
      <div className='flex gap-x-[4%] items-center w-full'>
        <Button
          href={`/accountant/management/tenants/${t.id}/manage`}
          size='sm_medium'
          className='px-8 py-2 mx-auto'
        >
          Preview
        </Button>
        {t.user_tag === 'mobile' && (
          <Button
            variant='sky_blue'
            size='sm_medium'
            className='px-8 py-2 bg-brand-tertiary bg-opacity-50 text-white mx-auto'
            // onClick={() => onClickChat(t)}
          >
            Chat
          </Button>
        )}
      </div>
    ),
  }));

  if (loading)
    return (
      <CustomLoader
        layout='page'
        pageTitle='Tenants/Occupants (Users)'
        statsCardCount={3}
      />
    );

  if (isNetworkError) return <NetworkError />;

  if (error) return <div>{error}</div>;

  return (
    <div className='space-y-8'>
      <div className='page-header-container'>
        <div className='hidden md:flex gap-5 flex-wrap'>
          <ManagementStatistcsCard
            title='Total Users'
            newData={new_tenants_this_month}
            total={total_tenants}
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title='Web Tenants'
            newData={new_web_tenants_this_month}
            total={web_tenants}
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title='Mobile Tenants'
            newData={new_mobile_tenants_this_month}
            total={mobile_tenants}
            colorScheme={3}
          />
        </div>
      </div>

      <FilterBar
        azFilter
        gridView={view === 'grid'}
        setGridView={() => setView('grid')}
        setListView={() => setView('list')}
        pageTitle='Tenants/Occupants (Users)'
        noExclamationMark
        searchInputPlaceholder='Search for Tenants & Occupants'
        dateLabel='Registration Date'
        handleFilterApply={handleFilterApply}
        isDateTrue
        handleSearch={handleSearch}
        onSort={handleSort}
        appliedFilters={appliedFilters}
        filterOptionsMenu={[
          {
            label: 'State',
            value: states.map((state) => ({
              label: state,
              value: state.toLowerCase(),
            })),
          },
          {
            radio: true,
            label: 'Tenant Type',
            value: [
              { label: 'Mobile Tenant', value: 'mobile' },
              { label: 'Web Tenant', value: 'web' },
              { label: 'All Tenants', value: 'all' },
            ],
          },
          ...(branchOptions.length > 0
            ? [
                {
                  label: 'Branch',
                  value: branchOptions,
                },
              ]
            : []),
        ]}
      />
      <section>
        {tenants.length === 0 && !silentLoading ? (
          config.params.search || isFilterApplied() ? (
            <div className='col-span-full text-center py-8 text-gray-500'>
              No Search/Filter Found
            </div>
          ) : (
            <EmptyList
              noButton
              title='The tenants and occupants profile files are empty.'
              body={
                <p>
                  You currently don&apos; have any tenants or occupant profile
                  assigned to your account. To proceed, please reach out to your
                  branch manager or company director to have one assigned to you
                  from the property creation profile.
                </p>
              }
            />
          )
        ) : (
          <>
            {view === 'grid' ? (
              <AutoResizingGrid
                minWidth={284}
                gap={16}
              >
                {silentLoading ? (
                  <CardsLoading />
                ) : (
                  tenants.map((t) => (
                    <Link
                      href={`/accountant/managment/tenants/${t.id}/manage`}
                      key={t.id}
                    >
                      <TenantCard
                        key={t.id}
                        picture_url={t.picture_url}
                        name={t.name}
                        user_tag={t.user_tag}
                        badge_color={t.badge_color}
                        email={t.email}
                        phone_number={t.phone_number}
                      />
                    </Link>
                  ))
                )}
              </AutoResizingGrid>
            ) : (
              <>
                {silentLoading ? (
                  <TableLoading />
                ) : (
                  <CustomTable
                    displayTableHead={false}
                    fields={tenantTableFields}
                    data={transformedTenants}
                    tableBodyCellSx={{ color: '#3F4247' }}
                  />
                )}
              </>
            )}

            <Pagination
              totalPages={total_pages}
              currentPage={current_page}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default Tenants;
