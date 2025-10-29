import { ParkingSpace } from '@/types'
import { cn } from '@/lib/utils'
import { Car, Accessibility } from 'lucide-react'

interface ParkingGridProps {
  spaces: ParkingSpace[]
  floor: 'SS' | 'S1'
  onSpaceClick?: (space_number: number) => void
  selectedSpace?: number | null
}

export function ParkingGrid({ spaces, floor, onSpaceClick, selectedSpace }: ParkingGridProps) {
  const floorSpaces = spaces.filter(space => space.floor === floor)
  
  const getSpaceIcon = (space: ParkingSpace) => {
    // Para espacios de discapacitados, no mostrar ícono de carro (solo accesibilidad)
    if (space.isDisabledSpace) {
      return null
    }
    
    // Para espacios regulares, mostrar ícono de carro según el estado
    switch (space.status) {
      case 'available':
        return <Car className="w-3 h-3 opacity-60" />
      case 'occupied':
        return <Car className="w-3 h-3" />
      case 'maintenance':
        return <Car className="w-3 h-3 opacity-75" />
      default:
        return <Car className="w-3 h-3 opacity-50" />
    }
  }

  const getSpaceColor = (space: ParkingSpace) => {
    if (selectedSpace === space.spaceNumber) {
      return 'bg-blue-500 text-white border-blue-600'
    }
    
    if (space.isDisabledSpace) {
      switch (space.status) {
        case 'available':
          return 'bg-purple-200 text-purple-800 border-purple-300 hover:bg-purple-300'
        case 'occupied':
          return 'bg-purple-300 text-purple-900 border-purple-400'
        case 'maintenance':
          return 'bg-purple-400 text-purple-900 border-purple-500'
        default:
          return 'bg-purple-200 text-purple-800 border-purple-300'
      }
    }
    
    switch (space.status) {
      case 'available':
        return 'bg-green-200 text-green-800 border-green-300 hover:bg-green-300'
      case 'occupied':
        return 'bg-red-200 text-red-800 border-red-300'
      case 'maintenance':
        return 'bg-yellow-200 text-yellow-800 border-yellow-300'
      default:
        return 'bg-gray-200 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-8 lg:grid-cols-10 gap-1.5">
        {floorSpaces.map((space) => (
          <button
            key={space.id}
            onClick={() => onSpaceClick?.(space.spaceNumber)}
            disabled={space.status === 'occupied' || space.status === 'maintenance'}
            className={cn(
              'aspect-square border rounded flex flex-col items-center justify-center text-xs font-medium transition-colors min-h-[40px]',
              getSpaceColor(space),
              onSpaceClick && space.status === 'available' && 'cursor-pointer',
              (space.status === 'occupied' || space.status === 'maintenance') && 'cursor-not-allowed opacity-75'
            )}
          >
            <span className="text-xs leading-none">{space.spaceNumber}</span>
            <div className="flex items-center justify-center mt-0.5">
              {space.isDisabledSpace && <Accessibility className="w-2.5 h-2.5" />}
              {getSpaceIcon(space)}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}