import { getTemplates, getContactSettings, getContactLeads, getPricingPlans } from '@/lib/db';
import { isAuthenticated } from '../actions';
import { redirect } from 'next/navigation';
import DashboardClient from './dashboard-client';

export default async function AdminDashboardPage() {
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    redirect('/admin/login');
  }

  const initialTemplates = await getTemplates();
  const initialContactSettings = await getContactSettings();
  const initialLeads = await getContactLeads();
  const initialPricingPlans = await getPricingPlans();

  return (
    <div className='min-h-screen bg-[#0f172a] text-slate-100 font-sans'>
      <DashboardClient
        initialTemplates={initialTemplates}
        initialContactSettings={initialContactSettings}
        initialLeads={initialLeads}
        initialPricingPlans={initialPricingPlans}
      />
    </div>
  );
}
