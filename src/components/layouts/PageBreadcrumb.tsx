import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem as BreadcrumbItemUI,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { BREADCRUMB_ITEMS_TO_DISPLAY } from '@/constants';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
}

const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ items }) => {
  const [open, setOpen] = React.useState(false);

  if (items.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.length <= BREADCRUMB_ITEMS_TO_DISPLAY ? (
          items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <React.Fragment key={index}>
                <BreadcrumbItemUI>
                  {item.href && !isLast ? (
                    <BreadcrumbLink asChild className={cn('max-w-20 truncate md:max-w-none text-primary', index === 0 && 'font-bold')}>
                      <Link to={item.href} className="flex items-center gap-1.5">
                        {item.icon && <span>{item.icon}</span>}
                        <span>{item.label}</span>
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className={cn('truncate md:max-w-none', item.icon && 'flex items-center gap-1.5')}>
                      {item.icon}
                      <span>{item.label}</span>
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItemUI>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })
        ) : (
          <>
            <BreadcrumbItemUI>
              <BreadcrumbLink asChild>
                <Link to={items[0].href ?? '/'}>{items[0].label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItemUI>
            <BreadcrumbSeparator />
            <BreadcrumbItemUI>
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger className="flex items-center gap-1" aria-label="Toggle menu">
                  <BreadcrumbEllipsis className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {items.slice(1, -2).map((item, index) => (
                    <DropdownMenuItem key={index}>
                      <Link to={item.href ?? '#'} className="w-full">{item.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItemUI>
            <BreadcrumbSeparator />
            {items.slice(-2).map((item, index) => {
              const isLast = index === 1;
              return (
                <React.Fragment key={index}>
                  <BreadcrumbItemUI>
                    {item.href && !isLast ? (
                      <BreadcrumbLink asChild className="truncate md:max-w-none">
                        <Link to={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="truncate md:max-w-none">{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItemUI>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageBreadcrumb;
