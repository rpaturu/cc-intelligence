import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TabProps {
  value: string;
  label: string;
  children: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  defaultValue: string;
  children: React.ReactElement<TabProps>[];
  className?: string;
}

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const tabs = React.Children.toArray(children) as React.ReactElement<TabProps>[];
  const activeContent = tabs.find(tab => tab.props.value === activeTab)?.props.children;

  return (
    <div className={cn("w-full", className)}>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.props.value}
            onClick={() => setActiveTab(tab.props.value)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200",
              activeTab === tab.props.value
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <span className="flex items-center gap-2">
              {tab.props.label}
              {tab.props.badge && (
                <span className={cn(
                  "px-2 py-0.5 text-xs rounded-full",
                  activeTab === tab.props.value
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600"
                )}>
                  {tab.props.badge}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-3">
        {activeContent}
      </div>
    </div>
  );
} 