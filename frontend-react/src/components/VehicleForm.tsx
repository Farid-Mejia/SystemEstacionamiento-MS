import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { VehicleRegistrationRequest } from '@/types'
import { Accessibility } from 'lucide-react'

interface VehicleFormProps {
  onSubmit: (data: VehicleRegistrationRequest) => void
  isLoading?: boolean
  initialData?: Partial<VehicleRegistrationRequest>
}

export function VehicleForm({ onSubmit, isLoading = false, initialData }: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleRegistrationRequest>({
    licensePlate: initialData?.licensePlate || '',
    spaceNumber: initialData?.spaceNumber || 0,
    userDni: initialData?.userDni || '',
    needsDisabledSpace: initialData?.needsDisabledSpace || false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'La placa es requerida'
    } else if (!/^[A-Z]{3}\d{3}$/.test(formData.licensePlate)) {
      newErrors.licensePlate = 'Formato de placa inválido (ABC123)'
    }

    if (!formData.userDni.trim()) {
      newErrors.userDni = 'El DNI es requerido'
    } else if (!/^\d{8}$/.test(formData.userDni)) {
      newErrors.userDni = 'El DNI debe tener 8 dígitos'
    }

    if (!formData.spaceNumber || formData.spaceNumber <= 0) {
      newErrors.spaceNumber = 'Debe seleccionar un espacio válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        licensePlate: formData.licensePlate.toUpperCase(),
      })
    }
  }

  const handleInputChange = (field: keyof VehicleRegistrationRequest, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Entrada de Vehículo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="license_plate">Placa del Vehículo</Label>
              <Input
                id="license_plate"
                placeholder="ABC123"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                maxLength={6}
              />
              {errors.licensePlate && (
                <p className="text-sm text-red-500">{errors.licensePlate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userDni">DNI del Usuario</Label>
              <Input
                id="userDni"
                placeholder="12345678"
                value={formData.userDni}
                onChange={(e) => handleInputChange('userDni', e.target.value)}
                className={errors.userDni ? 'border-red-500' : ''}
                maxLength={8}
              />
              {errors.userDni && (
                <p className="text-sm text-red-500">{errors.userDni}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="spaceNumber">Número de Espacio</Label>
              <Input
                id="spaceNumber"
                type="number"
                placeholder="1"
                value={formData.spaceNumber || ''}
                onChange={(e) => handleInputChange('spaceNumber', parseInt(e.target.value) || 0)}
                className={errors.spaceNumber ? 'border-red-500' : ''}
                min={1}
                max={40}
              />
              {errors.spaceNumber && (
                <p className="text-sm text-red-500">{errors.spaceNumber}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needsDisabledSpace"
                  checked={formData.needsDisabledSpace}
                  onCheckedChange={(checked) => handleInputChange('needsDisabledSpace', checked as boolean)}
                />
                <Label htmlFor="needsDisabledSpace" className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  <Accessibility className="w-4 h-4" />
                  Necesita espacio para personas con discapacidad
                </Label>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Registrando...' : 'Registrar Entrada'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}