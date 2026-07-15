"use client"

import { motion } from 'motion/react'
import { MapPin, MoreVertical, Plus } from 'lucide-react'
import Link from 'next/link'

interface Property {
  id: string
  address: string
  price: number
  status: 'Rented' | 'Vacant'
  image: string
}

export function PropertiesList({ properties }: { properties: Property[] }) {
  return (
    <div className="space-y-8 flex-1 flex flex-col min-h-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Imóveis</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm font-medium">Gerencie seu portfólio de propriedades.</p>
        </div>
        <Link 
          href="/dashboard/properties/new" 
          className="w-full sm:w-auto justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 sm:py-2.5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Imóvel
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-8">
        {properties.map((property, i) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-[1.75rem] overflow-hidden border border-slate-200/80 dark:border-gray-700 shadow-[var(--shadow-sm)] group hover:shadow-[var(--shadow-lg)] transition-all cursor-pointer flex flex-col relative"
          >
            <Link href={`/dashboard/properties/${property.id}`} className="absolute inset-0 z-10" aria-label={`Ver detalhes de ${property.address}`} />
            
            <div className="h-56 relative overflow-hidden">
              <img 
                src={property.image} 
                alt={property.address} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 z-20">
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm border border-white/20 ${
                  property.status === 'Rented' 
                    ? 'bg-emerald-500/90 text-white' 
                    : 'bg-white/90 dark:bg-gray-900/90 text-slate-900 dark:text-white'
                }`}>
                  {property.status === 'Rented' ? 'Alugado' : 'Vago'}
                </span>
              </div>
              <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer z-20">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="flex items-start space-x-2 mb-6">
                <MapPin className="w-5 h-5 text-slate-400 dark:text-gray-500 shrink-0 mt-0.5" />
                <h3 className="text-slate-800 dark:text-white font-bold leading-snug">{property.address}</h3>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-gray-700">
                <p className="text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-wider">Valor Mensal</p>
                <p className="text-xl font-black text-slate-900 dark:text-emerald-400">R$ {property.price.toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {properties.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
               <MapPin className="w-8 h-8 text-slate-300 dark:text-gray-600" />
             </div>
             <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nenhum imóvel cadastrado</h3>
             <p className="text-slate-500 dark:text-gray-400 mt-2 max-w-sm">Comece a gerenciar seu portfólio adicionando seu primeiro imóvel.</p>
          </div>
        )}
      </div>
    </div>
  )
}
