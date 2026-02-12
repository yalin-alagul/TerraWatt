import TimeSliderMap from '@/components/TimeSliderMap';
import PageHeader from '@/components/PageHeader';
import EmissionsLeaderboard from '@/components/EmissionsLeaderboard';

export default function MapPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Global Renewable Energy Map"
        description="Drag the slider to visualize the growth of renewable energy over the last 25 years. Click any country to explore its energy profile."
      />
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          <TimeSliderMap />
        </div>
        <div className="xl:col-span-1 space-y-6">
          <h3 className="text-xl font-bold text-white px-1">Global Rankings</h3>
          <EmissionsLeaderboard year={2024} />
          <div className="p-4 bg-slate-800/40 border border-slate-700 rounded-xl">
            <h4 className="text-sm font-bold text-slate-300 mb-2">Did you know?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Iceland consistently leads the world in renewable energy, harvesting nearly 100% of its electricity from geothermal and hydro sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
