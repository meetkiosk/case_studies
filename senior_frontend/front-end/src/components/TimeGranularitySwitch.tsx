import React, { useState } from 'react';

interface TimeGranularitySwitchProps {
    currentGranularity: string;
    onChange: (granularity: string) => void;
}

const TimeGranularitySwitch: React.FC<TimeGranularitySwitchProps> = ({ currentGranularity, onChange }) => {
    const granularities = [
        { label: 'horaire', value: 'hourly' },
        { label: 'quotidien', value: 'daily' },
        { label: 'mensuel', value: 'monthly' },
        { label: 'annuel', value: 'yearly' }
    ];

    return (
        <div className="fixed bottom-3 left-3 z-20 w-[calc(14vw_+_16rem)] rounded-xl bg-white px-4 py-3 shadow-xl drop-shadow-2xl min-[780px]:w-[calc((14vw_+_16rem)_-_30px)] xl:px-5 dark:bg-gray-800">
          <div>
            <div className="flex flex-row items-baseline justify-between sm:pb-2 hidden sm:flex">
              <p className="select-none text-left text-base font-bold">Afficher les données passées</p>
              <div className="h-10 sm:h-8">
                <div className="select-none whitespace-nowrap rounded-full bg-brand-green/10 px-2 py-1 text-sm text-brand-green lg:px-3 dark:bg-gray-700 dark:text-white">2 juin 2024</div>
              </div>
            </div>
            <div role="group" dir="ltr" className="flex-start mb-2 flex flex-row items-center gap-x-2 md:gap-x-1.5 lg:gap-x-2" aria-label="Font settings" tabIndex={0}>
              {granularities.map(granularity => (
                <button
                  key={granularity.value}
                  type="button"
                  aria-pressed={currentGranularity === granularity.value}
                  className={`inline-flex select-none rounded-full px-2.5 py-2 text-sm capitalize sm:px-2 lg:px-3 ${
                    currentGranularity === granularity.value
                      ? 'items-center bg-white font-bold text-green-900 shadow-2xl dark:border dark:border-gray-400/10 dark:bg-gray-600 dark:text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                  onClick={() => onChange(granularity.value)}
                >
                  <p className="w-15 dark:opacity-80">{granularity.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
    );
};

export default TimeGranularitySwitch;