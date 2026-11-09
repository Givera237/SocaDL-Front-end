import { ReactNode } from "react"; // ← Ajoute cet import si pas déjà présent

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode; // ← Change string par ReactNode
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-[hsl(20_60%_20%)]">{title}</h1>
        {subtitle && (
          <div className="text-sm text-[hsl(36_15%_60%)]">{subtitle}</div>
        )}
      </div>
      {actions && <div className="mt-2 sm:mt-0">{actions}</div>}
    </div>
  );
}