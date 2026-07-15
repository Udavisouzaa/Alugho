"use client"

import { motion } from 'motion/react'
import { Card } from './Card'

interface StatCardProps {
  title: string
  value: string
  trend: string
  isPositive: boolean
  delay?: number
  children?: React.ReactNode
}

export function StatCard({ title, value, trend, isPositive, delay = 0, children }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="p-6 flex flex-col gap-1">
        <span className="text-slate-400 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest">{title}</span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend}
          </span>
        </div>
        {children}
      </Card>
    </motion.div>
  )
}
