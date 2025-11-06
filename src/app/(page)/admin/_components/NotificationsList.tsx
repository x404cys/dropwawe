'use client';

import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

export interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}

const NotificationsList = ({ notifications }: { notifications: Notification[] }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-900">أحدث الإشعارات</h2>
      <div className="rounded-xl bg-gray-50 p-2">
        <Bell className="h-5 w-5 text-gray-600" />
      </div>
    </div>
    {notifications.length > 0 ? (
      <div className="space-y-3">
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-4 rounded-xl bg-gray-50/50 p-4 hover:bg-gray-50"
          >
            <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400" />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{notification.type}</span>
                <span className="text-xs text-gray-400">الآن</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">{notification.message}</p>
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <div className="py-8 text-center">
        <Bell className="mx-auto mb-3 h-12 w-12 text-gray-300" />
        <p className="text-gray-500">لا توجد إشعارات حالياً</p>
      </div>
    )}
  </div>
);

export default NotificationsList;
