import TimeSliderMap from '@/components/TimeSliderMap';
import PageHeader from '@/components/PageHeader';

export default function MapPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Renewable Energy Map"
        description="Drag the slider to visualize the growth of renewable energy over the last 25 years. Click any country to explore its energy profile."
      />
      <TimeSliderMap />
    </div>
  );
}
