
import React from 'react';
import { APP_CONFIG } from '../constants';

const QuickAction: React.FC = () => {
  const { quickAction } = APP_CONFIG.main.home;

  return (
    <div className="grid grid-cols-5 gap-2 px-4 mt-6">
      {quickAction.map((action) => (
        <div key={action.id} className="flex flex-col items-center gap-2 group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <div dangerouslySetInnerHTML={{ __html: action.icon }} />
          </div>
          <span className="text-[10px] font-medium text-gray-500 group-hover:text-gray-900">{action.title}</span>
        </div>
      ))}
    </div>
  );
};

export default QuickAction;
