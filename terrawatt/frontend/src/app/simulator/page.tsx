import GridSimulator from '@/components/GridSimulator';
import PageHeader from '@/components/PageHeader';

export default function SimulatorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Grid Scenario Planner"
        description="Adjust the energy mix for 2024 to see the potential impact on CO2 emissions. Can you meet the climate goals while balancing the grid?"
      />
      <GridSimulator />
    </div>
  );
}
