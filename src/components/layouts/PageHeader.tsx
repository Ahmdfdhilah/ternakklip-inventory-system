import React from 'react';
import PageBreadcrumb from './PageBreadcrumb';
import { useLayoutStore } from '@/stores/layoutStore';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ className }) => {
  const { header } = useLayoutStore();

  if (!header) return null;

  return (
    <div className={cn("flex flex-col px-6 pt-4 pb-2", className)}>
      {header.breadcrumb && header.breadcrumb.length > 0 && (
        <PageBreadcrumb items={header.breadcrumb} />
      )}
      <div className="flex flex-col mt-0.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {header.title}
        </h1>
        {header.description && (
          <p className="text-sm text-muted-foreground max-w-[700px] leading-relaxed">
            {header.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
