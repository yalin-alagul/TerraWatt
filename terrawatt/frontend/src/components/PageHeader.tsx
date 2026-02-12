interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 pb-6 border-b border-slate-800">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
      <p className="text-slate-400 max-w-2xl">{description}</p>
    </div>
  );
}
