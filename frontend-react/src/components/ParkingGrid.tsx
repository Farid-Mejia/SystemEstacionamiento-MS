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
    if (space.status === 'available') return null
    return <Car className="w-3 h-3" />
  }

  const getSpaceColor = (space: ParkingSpace) => {
    if (selectedSpace === space.space_number) {
      return 'bg-blue-500 text-white border-blue-600'
    }
    
    if (space.is_disabled_space) {
      switch (space.status) {
        case 'available':
          return 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200'
        case 'occupied':
          return 'bg-purple-200 text-purple-900 border-purple-400'
        case 'maintenance':
          return 'bg-purple-300 text-purple-900 border-purple-500'
        default:
          return 'bg-purple-100 text-purple-800 border-purple-300'
      }
    }
    
    switch (space.status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
      case 'occupied':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-8 lg:grid-cols-10 gap-1.5">
        {floorSpaces.map((space) => (
          <button
            key={space.id}
            onClick={() => onSpaceClick?.(space.space_number)}
            disabled={space.status === 'occupied' || space.status === 'maintenance'}
            className={cn(
              'aspect-square border rounded flex flex-col items-center justify-center text-xs font-medium transition-colors min-h-[40px]',
              getSpaceColor(space),
              onSpaceClick && space.status === 'available' && 'cursor-pointer',
              (space.status === 'occupied' || space.status === 'maintenance') && 'cursor-not-allowed opacity-75'
            )}
          >
            <span className="text-xs leading-none">{space.space_number}</span>
            <div className="flex items-center justify-center mt-0.5">
              {space.is_disabled_space && <Accessibility className="w-2.5 h-2.5" />}
              {getSpaceIcon(space)}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}