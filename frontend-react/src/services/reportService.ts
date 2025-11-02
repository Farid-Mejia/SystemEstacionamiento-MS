import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface HistoricalRecord {
  id: string;
  licensePlate: string;
  dni: string;
  visitor_name: string;
  space_number: number;
  space_type: 'normal' | 'disability' | 'maintenance';
  entryTime: Date;
  exitTime: Date;
  duration: number; // en minutos
  floor: string;
}

export interface DailyStats {
  date: string;
  vehicles: number;
  avgDuration: number;
  occupancyRate: number;
}

export interface MonthlyStats {
  month: string;
  vehicles: number;
  avgDuration: number;
  occupancyRate: number;
}

export interface ReportSummary {
  totalVehicles: number;
  avgDuration: number;
  avgOccupancy: number;
  peakDay: string;
  peakHour: string;
}

// Interface actualizada para los datos optimizados del backend (propiedades planas)
interface OptimizedParkingSession {
  id: number;
  user_id: number;
  vehicle_id: number;
  space_id: number;
  entry_time: string;
  exit_time: string | null;
  total_amount: number;
  status: 'active' | 'completed';
  duration_minutes: number;
  // Datos del usuario
  user_name: string;
  user_dni: string;
  user_email: string;
  // Datos del vehículo
  license_plate: string;
  vehicle_model: string;
  vehicle_color: string;
  // Datos del espacio
  space_code: string;
  floor_level: string;
}

// ===== SISTEMA DE CACHÉ INTELIGENTE =====
interface CacheEntry {
  data: HistoricalRecord[];
  timestamp: number;
  dateRange: string;
}

class ReportCache {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutos - más tiempo para mejor rendimiento

  private getCacheKey(startDate?: Date, endDate?: Date): string {
    const start = startDate ? format(startDate, 'yyyy-MM-dd') : 'all';
    const end = endDate ? format(endDate, 'yyyy-MM-dd') : 'all';
    return `${start}_${end}`;
  }

  get(startDate?: Date, endDate?: Date): HistoricalRecord[] | null {
    const key = this.getCacheKey(startDate, endDate);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Verificar si el caché ha expirado
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    console.log('📦 Usando datos del caché para:', key);
    return entry.data;
  }

  set(data: HistoricalRecord[], startDate?: Date, endDate?: Date): void {
    const key = this.getCacheKey(startDate, endDate);
    const dateRange = `${startDate ? format(startDate, 'dd/MM/yyyy') : 'Inicio'} - ${endDate ? format(endDate, 'dd/MM/yyyy') : 'Fin'}`;
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      dateRange
    });
    
    console.log('💾 Datos guardados en caché para:', key, `(${data.length} registros)`);
  }

  clear(): void {
    this.cache.clear();
    console.log('🗑️ Caché limpiado');
  }

  getStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

// Instancia global del caché
const reportCache = new ReportCache();

// Función optimizada para obtener datos de parking sessions con toda la información incluida
const fetchParkingData = async (): Promise<{
  parkingSessions: OptimizedParkingSession[];
}> => {
  try {
    console.log('🌐 Realizando llamada a la API...');
    const response = await fetch('/api/reports/parking-sessions/completed');

    if (!response.ok) {
      throw new Error('Error al obtener datos del servidor');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error('Error en la respuesta del servidor');
    }

    console.log('✅ Datos obtenidos de la API:', data.data.length, 'registros');
    return {
      parkingSessions: data.data
    };
  } catch (error) {
    console.error('❌ Error fetching parking data:', error);
    throw new Error('No se pudieron obtener los datos de estacionamiento. Verifique la conexión con el servidor.');
  }
};

// Función actualizada para convertir datos optimizados a HistoricalRecord
const convertToHistoricalRecords = (sessions: OptimizedParkingSession[]): HistoricalRecord[] => {
  const records = sessions.map(session => {
    const entryTime = new Date(session.entry_time);
    const exitTime = session.exit_time ? new Date(session.exit_time) : new Date();
    
    // SIEMPRE calcular duración basándose en las fechas para asegurar precisión
    let duration = 0;
    if (session.exit_time) {
      // Calcular duración en minutos
      duration = Math.floor((exitTime.getTime() - entryTime.getTime()) / (1000 * 60));
      
      // Validar que la duración sea positiva
      if (duration < 0) {
        console.warn(`⚠️ Duración negativa detectada para sesión ${session.id}:`, {
          entry_time: session.entry_time,
          exit_time: session.exit_time,
          calculated_duration: duration
        });
        duration = 0;
      }
    }
    
    // Debug: Log para verificar cálculos de duración (solo primeras 3 sesiones)
    if (session.id <= 3) {
      console.log(`🔍 Sesión ${session.id}:`, {
        entry_time: session.entry_time,
        exit_time: session.exit_time,
        duration_from_backend: session.duration_minutes,
        calculated_duration: duration,
        entryTime: entryTime.toISOString(),
        exitTime: exitTime.toISOString(),
        time_diff_ms: exitTime.getTime() - entryTime.getTime()
      });
    }
    
    const record: HistoricalRecord = {
      id: session.id.toString(),
      licensePlate: session.license_plate || 'N/A',
      dni: session.user_dni || 'N/A',
      visitor_name: session.user_name || 'N/A',
      space_number: parseInt(session.space_code?.replace(/\D/g, '') || '1'),
      space_type: 'normal' as const,
      entryTime: entryTime,
      exitTime: exitTime,
      duration: duration,
      floor: session.floor_level || (session.space_code?.startsWith('SS-') ? 'Sótano' : 'Primer Piso')
    };
    
    return record;
  });
  
  return records;
};

// ===== FUNCIÓN PRINCIPAL OPTIMIZADA =====
// Esta función hace UNA sola llamada a la API y maneja todo el caché
const getOptimizedHistoricalRecords = async (startDate?: Date, endDate?: Date): Promise<HistoricalRecord[]> => {
  // 1. Verificar caché primero
  const cachedData = reportCache.get(startDate, endDate);
  if (cachedData) {
    return cachedData;
  }

  // 2. Si no hay caché, hacer UNA llamada a la API
  const { parkingSessions } = await fetchParkingData();
  let records = convertToHistoricalRecords(parkingSessions);
  
  // 3. Filtrar por fechas si es necesario
  if (startDate) {
    records = records.filter(record => record.entryTime >= startDate);
  }
  
  if (endDate) {
    records = records.filter(record => record.entryTime <= endDate);
  }
  
  // 4. Guardar en caché
  reportCache.set(records, startDate, endDate);
  
  return records;
};

export const reportService = {
  // Obtener TODOS los registros históricos sin filtro (para carga inicial)
  getAllHistoricalRecords: async (): Promise<HistoricalRecord[]> => {
    console.log('📥 Obteniendo TODOS los registros históricos...');
    
    // Verificar si ya tenemos todos los datos en caché
    const cachedData = reportCache.get();
    if (cachedData) {
      console.log('📦 Usando todos los datos del caché:', cachedData.length, 'registros');
      return cachedData;
    }

    // Si no hay caché, hacer la llamada a la API
    const { parkingSessions } = await fetchParkingData();
    const records = convertToHistoricalRecords(parkingSessions);
    
    // Guardar TODOS los datos en caché sin filtro de fechas
    reportCache.set(records);
    
    console.log('💾 Todos los datos guardados en caché:', records.length, 'registros');
    return records;
  },

  // Obtener registros históricos (ahora usa caché)
  getHistoricalRecords: async (startDate?: Date, endDate?: Date): Promise<HistoricalRecord[]> => {
    // Si no se especifican fechas, usar la función para obtener todos los datos
    if (!startDate && !endDate) {
      return reportService.getAllHistoricalRecords();
    }
    return getOptimizedHistoricalRecords(startDate, endDate);
  },

  // Obtener estadísticas diarias (optimizado - usa datos cacheados)
  getDailyStats: async (startDate?: Date, endDate?: Date): Promise<DailyStats[]> => {
    // Usar la función optimizada que maneja el caché
    const records = await getOptimizedHistoricalRecords(startDate, endDate);
    const dailyGroups = new Map<string, HistoricalRecord[]>();
    
    records.forEach(record => {
      const dateKey = format(record.entryTime, 'yyyy-MM-dd');
      if (!dailyGroups.has(dateKey)) {
        dailyGroups.set(dateKey, []);
      }
      dailyGroups.get(dateKey)!.push(record);
    });
    
    const dailyStats = Array.from(dailyGroups.entries()).map(([date, dayRecords]) => {
      const avgDuration = dayRecords.reduce((sum, record) => sum + record.duration, 0) / dayRecords.length;
      const occupancyRate = Math.min((dayRecords.length / 40) * 100, 100); // Asumiendo 40 espacios totales
      
      return {
        date,
        vehicles: dayRecords.length,
        avgDuration: Math.round(avgDuration),
        occupancyRate: Math.round(occupancyRate * 100) / 100
      };
    }).sort((a, b) => a.date.localeCompare(b.date));
    
    return dailyStats;
  },

  // Obtener estadísticas mensuales (optimizado - usa datos cacheados)
  getMonthlyStats: async (startDate?: Date, endDate?: Date): Promise<MonthlyStats[]> => {
    // Usar la función optimizada que maneja el caché
    const records = await getOptimizedHistoricalRecords(startDate, endDate);
    const monthlyGroups = new Map<string, HistoricalRecord[]>();
    
    records.forEach(record => {
      const monthKey = format(record.entryTime, 'yyyy-MM');
      if (!monthlyGroups.has(monthKey)) {
        monthlyGroups.set(monthKey, []);
      }
      monthlyGroups.get(monthKey)!.push(record);
    });
    
    const monthlyStats = Array.from(monthlyGroups.entries()).map(([month, monthRecords]) => {
      const avgDuration = monthRecords.reduce((sum, record) => sum + record.duration, 0) / monthRecords.length;
      const daysInMonth = new Date(parseInt(month.split('-')[0]), parseInt(month.split('-')[1]), 0).getDate();
      const occupancyRate = (monthRecords.length / (40 * daysInMonth)) * 100;
      
      return {
        month: format(new Date(month + '-01'), 'MMMM yyyy', { locale: es }),
        vehicles: monthRecords.length,
        avgDuration: Math.round(avgDuration),
        occupancyRate: Math.round(occupancyRate * 100) / 100
      };
    }).sort((a, b) => a.month.localeCompare(b.month));
    
    return monthlyStats;
  },
  
  // Obtener resumen del reporte (optimizado - usa datos cacheados)
  getReportSummary: async (startDate?: Date, endDate?: Date): Promise<ReportSummary> => {
    // Usar la función optimizada que maneja el caché
    const records = await getOptimizedHistoricalRecords(startDate, endDate);
    
    if (records.length === 0) {
      return {
        totalVehicles: 0,
        avgDuration: 0,
        avgOccupancy: 0,
        peakDay: 'N/A',
        peakHour: 'N/A'
      };
    }
    
    const totalVehicles = records.length;
    const avgDuration = records.reduce((sum, record) => sum + record.duration, 0) / records.length;
    
    // Calcular estadísticas diarias localmente (sin llamada adicional)
    const dailyGroups = new Map<string, HistoricalRecord[]>();
    records.forEach(record => {
      const dateKey = format(record.entryTime, 'yyyy-MM-dd');
      if (!dailyGroups.has(dateKey)) {
        dailyGroups.set(dateKey, []);
      }
      dailyGroups.get(dateKey)!.push(record);
    });
    
    const dailyStats = Array.from(dailyGroups.entries()).map(([date, dayRecords]) => ({
      date,
      vehicles: dayRecords.length,
      occupancyRate: Math.min((dayRecords.length / 40) * 100, 100)
    }));
    
    // Calcular día pico
    const peakDay = dailyStats.reduce((max, day) => day.vehicles > max.vehicles ? day : max, dailyStats[0]);
    
    // Calcular hora pico
    const hourlyGroups = new Map<number, number>();
    records.forEach(record => {
      const hour = record.entryTime.getHours();
      hourlyGroups.set(hour, (hourlyGroups.get(hour) || 0) + 1);
    });
    
    const peakHour = Array.from(hourlyGroups.entries()).reduce((max, [hour, count]) => 
      count > max[1] ? [hour, count] : max, [0, 0]
    )[0];
    
    const avgOccupancy = dailyStats.reduce((sum, day) => sum + day.occupancyRate, 0) / dailyStats.length;
    
    const summary = {
      totalVehicles,
      avgDuration: Math.round(avgDuration),
      avgOccupancy: Math.round(avgOccupancy * 100) / 100,
      peakDay: format(new Date(peakDay.date), 'dd/MM/yyyy'),
      peakHour: `${peakHour}:00`
    };
    
    return summary;
  },

  // Función para limpiar caché manualmente (útil para desarrollo)
  clearCache: (): void => {
    reportCache.clear();
  },

  // Función para obtener estadísticas del caché (útil para debugging)
  getCacheStats: () => {
    return reportCache.getStats();
  }
};