'use client';

import { PiStorefront } from 'react-icons/pi';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { IoShareSocialOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';

type StepId = 'basic' | 'shipping' | 'social';

interface StepIndicatorProps {
  activeSection: StepId;
  fieldErrors: { [key: string]: string };
  onStepChange: (step: StepId) => void;
}

export function StepIndicator({ activeSection, fieldErrors, onStepChange }: StepIndicatorProps) {
  const steps = [
    { id: 'basic' as StepId, label: 'الاساسية', icon: <PiStorefront size={20} /> },
    { id: 'shipping' as StepId, label: 'التوصيل', icon: <LiaShippingFastSolid size={22} /> },
    { id: 'social' as StepId, label: 'الروابط', icon: <IoShareSocialOutline size={20} /> },
  ];

  const getStepError = (stepId: StepId) => {
    if (stepId === 'basic')
      return fieldErrors.name || fieldErrors.description || fieldErrors.subLink;
    if (stepId === 'shipping') return fieldErrors.phone || fieldErrors.shippingPrice;
    if (stepId === 'social')
      return fieldErrors.facebookLink || fieldErrors.instaLink || fieldErrors.telegram;
  };

  const activeIndex = steps.findIndex(s => s.id === activeSection);

  return (
    <div className="relative w-full">
      <div className="absolute top-5 right-0 left-0 h-0.5 bg-sky-200">
        <motion.div
          className="h-0.5 bg-sky-700"
          animate={{
            width: `${((activeIndex + 1) / steps.length) * 100}%`,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-between">
        {steps.map((step, index) => {
          const active = activeSection === step.id;
          const completed = index < activeIndex;
          const hasError = getStepError(step.id);

          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className="group flex flex-col items-center gap-3 transition-all"
            >
              <motion.div
                animate={{
                  scale: active ? 1.08 : 1,
                }}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  active || completed
                    ? 'border-sky-700 bg-sky-700'
                    : 'border-sky-300 bg-white group-hover:border-sky-600'
                } `}
              >
                <span className={active || completed ? 'text-white' : 'text-sky-600'}>
                  {step.icon}
                </span>

                {hasError && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border border-white bg-red-500" />
                )}
              </motion.div>

              <p
                className={`text-xs font-medium transition-colors ${
                  active ? 'text-sky-700' : 'text-sky-600'
                }`}
              >
                {step.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
