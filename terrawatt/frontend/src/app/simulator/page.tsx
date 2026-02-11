import GridSimulator from '@/components/GridSimulator';

export default function SimulatorPage() {
  return (
    <div className="space-y-6">
       <div className="max-w-3xl">
          <h1 className="text-3xl font-bold">Grid Scenario Planner</h1>
          <p className="text-slate-400">
             Adjust the energy mix for 2024 to see the potential impact on CO2 emissions. 
             Can you meet the climate goals while balancing the grid?
          </p>
       </div>
       <GridSimulator />
    </div>
  );
}
