import PageHeader from '@/components/PageHeader';
import CompareView from '@/components/CompareView';
import RegionalOverview from '@/components/RegionalOverview';

export default function ComparePage() {
  return (
    <div className="space-y-12">
      <section>
        <PageHeader
          title="Regional Overview"
          description="Global trends aggregated by geographic region. Compare renewable adoption and grid storage capacity across continents."
        />
        <RegionalOverview />
      </section>

      <section className="pt-8 border-t border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-2">Country Comparison</h2>
        <p className="text-slate-400 mb-8">Select up to 3 countries to compare their energy mix, carbon intensity, and emissions side by side.</p>
        <CompareView />
      </section>
    </div>
  );
}
