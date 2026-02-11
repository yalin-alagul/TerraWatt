import TimeSliderMap from '@/components/TimeSliderMap';

export default function MapPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Global Renewable Energy Trends</h1>
      <p className="text-slate-400">Drag the slider to visualize the growth of renewable energy over the last 25 years.</p>
      <TimeSliderMap />
    </div>
  );
}
