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
    license_plate: initialData?.license_plate || '',
    space_number: initialData?.space_number || 0,
    user_dni: initialData?.user_dni || '',
    needs_disabled_space: initialData?.needs_disabled_space || false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.license_plate.trim()) {
      newErrors.license_plate = 'La placa es requerida'
    } else if (!/^[A-Z]{3}\d{3}$/.test(formData.license_plate)) {
      newErrors.license_plate = 'Formato de placa inválido (ABC123)'
    }

    if (!formData.user_dni.trim()) {
      newErrors.user_dni = 'El DNI es requerido'
    } else if (!/^\d{8}$/.test(formData.user_dni)) {
      newErrors.user_dni = 'El DNI debe tener 8 dígitos'
    }

    if (!formData.space_number || formData.space_number <= 0) {
      newErrors.space_number = 'Debe seleccionar un espacio válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        license_plate: formData.license_plate.toUpperCase(),
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
                value={formData.license_plate}
                onChange={(e) => setFormData({ ...formData, license_plate: e.target.value.toUpperCase() })}
                maxLength={6}
              />
              {errors.license_plate && (
                <p className="text-sm text-red-500">{errors.license_plate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_dni">DNI del Usuario</Label>
              <Input
                id="user_dni"
                placeholder="12345678"
                value={formData.user_dni}
                onChange={(e) => handleInputChange('user_dni', e.target.value)}
                className={errors.user_dni ? 'border-red-500' : ''}
                maxLength={8}
              />
              {errors.user_dni && (
                <p className="text-sm text-red-500">{errors.user_dni}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="space_number">Número de Espacio</Label>
              <Input
                id="space_number"
                type="number"
                placeholder="1"
                value={formData.space_number || ''}
                onChange={(e) => handleInputChange('space_number', parseInt(e.target.value) || 0)}
                className={errors.space_number ? 'border-red-500' : ''}
                min={1}
                max={40}
              />
              {errors.space_number && (
                <p className="text-sm text-red-500">{errors.space_number}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needs_disabled_space"
                  checked={formData.needs_disabled_space}
                  onCheckedChange={(checked) => handleInputChange('needs_disabled_space', checked as boolean)}
                />
                <Label htmlFor="needs_disabled_space" className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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