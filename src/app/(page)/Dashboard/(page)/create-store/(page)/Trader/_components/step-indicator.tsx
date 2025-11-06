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

  const progressWidth =
    activeSection === 'basic' ? '33%' : activeSection === 'shipping' ? '66%' : '100%';

  return (
    <div className="w-full">
      <div className="relative z-10 flex justify-around py-2">
        {steps.map(step => {
          const hasError = getStepError(step.id);
          const active = activeSection === step.id;

          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className="flex flex-col items-center gap-2 transition"
            >
              <motion.div
                animate={{
                  scale: active ? 1.12 : 1,
                  borderColor: active ? '#000' : '#d1d5db',
                  backgroundColor: active ? '#000' : '#fff',
                }}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all`}
              >
                <span className={active ? 'text-white' : 'text-gray-600'}>{step.icon}</span>
                {hasError && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500"></span>
                )}
              </motion.div>

              <p className={`text-xs font-medium ${active ? 'text-black' : 'text-gray-500'}`}>
                {step.label}
              </p>
            </button>
          );
        })}
      </div>

      <div className="relative mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <motion.div
          className="h-1.5 rounded-full bg-black"
          animate={{ width: progressWidth }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
