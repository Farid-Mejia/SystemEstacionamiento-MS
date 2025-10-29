import { format, subDays, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

export interface HistoricalRecord {
  id: string;
  license_plate: string;
  dni: string;
  visitor_name: string;
  space_number: number;
  space_type: 'normal' | 'disability' | 'maintenance';
  entry_time: Date;
  exit_time: Date;
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

// Generar datos históricos mock
const generateHistoricalData = (): HistoricalRecord[] => {
  const records: HistoricalRecord[] = [];
  const today = new Date();
  const startDate = subMonths(today, 6); // Últimos 6 meses
  
  const license_plates = [
    'ABC123', 'DEF456', 'GHI789', 'JKL012', 'MNO345', 'PQR678', 'STU901', 'VWX234',
    'YZA567', 'BCD890', 'EFG123', 'HIJ456', 'KLM789', 'NOP012', 'QRS345', 'TUV678',
    'WXY901', 'ZAB234', 'CDE567', 'FGH890', 'IJK123', 'LMN456', 'OPQ789', 'RST012'
  ];
  
  const names = [
    'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez',
    'Carmen Fernández', 'José González', 'Isabel Sánchez', 'Miguel Torres', 'Laura Ruiz',
    'Antonio Jiménez', 'Pilar Moreno', 'Francisco Álvarez', 'Rosa Romero', 'Manuel Navarro'
  ];

  // Generar registros para cada día
  const days = eachDayOfInterval({ start: startDate, end: today });
  
  days.forEach((day, dayIndex) => {
    // Número variable de vehículos por día (5-25)
    const vehiclesPerDay = Math.floor(Math.random() * 20) + 5;
    
    for (let i = 0; i < vehiclesPerDay; i++) {
      const entryHour = Math.floor(Math.random() * 12) + 7; // 7 AM - 7 PM
      const entryMinute = Math.floor(Math.random() * 60);
      const entry_time = new Date(day);
      entry_time.setHours(entryHour, entryMinute, 0, 0);
      
      // Duración entre 30 minutos y 8 horas
      const durationMinutes = Math.floor(Math.random() * 450) + 30;
      const exit_time = new Date(entry_time.getTime() + durationMinutes * 60000);
      
      // Asegurar que no exceda el día actual
      if (exit_time > today) continue;
      
      const space_types: ('normal' | 'disability' | 'maintenance')[] = ['normal', 'normal', 'normal', 'normal', 'disability', 'maintenance'];
      const space_type = space_types[Math.floor(Math.random() * space_types.length)];
      
      records.push({
        id: `${dayIndex}-${i}`,
        license_plate: license_plates[Math.floor(Math.random() * license_plates.length)],
        dni: `${Math.floor(Math.random() * 90000000) + 10000000}`,
        visitor_name: names[Math.floor(Math.random() * names.length)],
        space_number: Math.floor(Math.random() * 40) + 1,
        space_type,
        entry_time,
        exit_time,
        duration: durationMinutes,
        floor: Math.random() > 0.5 ? 'SS' : 'S1'
      });
    }
  });
  
  return records.sort((a, b) => b.entry_time.getTime() - a.entry_time.getTime());
};

const historicalData = generateHistoricalData();

export const reportService = {
  // Obtener todos los registros históricos
  getHistoricalRecords: (startDate?: Date, endDate?: Date): HistoricalRecord[] => {
    let filtered = historicalData;
    
    if (startDate) {
      filtered = filtered.filter(record => record.entry_time >= startDate);
    }
    
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(record => record.entry_time <= endOfDay);
    }
    
    return filtered;
  },

  // Obtener estadísticas diarias
  getDailyStats: (startDate?: Date, endDate?: Date): DailyStats[] => {
    const records = reportService.getHistoricalRecords(startDate, endDate);
    const dailyMap = new Map<string, HistoricalRecord[]>();
    
    records.forEach(record => {
      const dateKey = format(record.entry_time, 'yyyy-MM-dd');
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, []);
      }
      dailyMap.get(dateKey)!.push(record);
    });
    
    const stats: DailyStats[] = [];
    dailyMap.forEach((dayRecords, dateKey) => {
      const avgDuration = dayRecords.reduce((sum, record) => sum + record.duration, 0) / dayRecords.length;
      const occupancyRate = Math.min((dayRecords.length / 40) * 100, 100); // 40 espacios totales
      
      stats.push({
        date: dateKey,
        vehicles: dayRecords.length,
        avgDuration: Math.round(avgDuration),
        occupancyRate: Math.round(occupancyRate * 100) / 100
      });
    });
    
    return stats.sort((a, b) => a.date.localeCompare(b.date));
  },

  // Obtener estadísticas mensuales
  getMonthlyStats: (startDate?: Date, endDate?: Date): MonthlyStats[] => {
    const records = reportService.getHistoricalRecords(startDate, endDate);
    const monthlyMap = new Map<string, HistoricalRecord[]>();
    
    records.forEach(record => {
      const monthKey = format(record.entry_time, 'yyyy-MM');
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, []);
      }
      monthlyMap.get(monthKey)!.push(record);
    });
    
    const stats: MonthlyStats[] = [];
    monthlyMap.forEach((monthRecords, monthKey) => {
      const avgDuration = monthRecords.reduce((sum, record) => sum + record.duration, 0) / monthRecords.length;
      const daysInMonth = new Date(parseInt(monthKey.split('-')[0]), parseInt(monthKey.split('-')[1]), 0).getDate();
      const occupancyRate = (monthRecords.length / (40 * daysInMonth)) * 100;
      
      stats.push({
        month: format(new Date(monthKey + '-01'), 'MMMM yyyy', { locale: es }),
        vehicles: monthRecords.length,
        avgDuration: Math.round(avgDuration),
        occupancyRate: Math.round(occupancyRate * 100) / 100
      });
    });
    
    return stats.sort((a, b) => a.month.localeCompare(b.month));
  },

  // Obtener resumen general
  getReportSummary: (startDate?: Date, endDate?: Date): ReportSummary => {
    const records = reportService.getHistoricalRecords(startDate, endDate);
    const dailyStats = reportService.getDailyStats(startDate, endDate);
    
    const totalVehicles = records.length;
    const avgDuration = records.reduce((sum, record) => sum + record.duration, 0) / totalVehicles;
    const avgOccupancy = dailyStats.reduce((sum, day) => sum + day.occupancyRate, 0) / dailyStats.length;
    
    // Encontrar día pico
    const peakDayData = dailyStats.reduce((max, day) => 
      day.vehicles > max.vehicles ? day : max, dailyStats[0] || { vehicles: 0, date: '' });
    
    // Encontrar hora pico (simulado)
    const hourCounts = new Array(24).fill(0);
    records.forEach(record => {
      hourCounts[record.entry_time.getHours()]++;
    });
    const peakHourIndex = hourCounts.indexOf(Math.max(...hourCounts));
    
    return {
      totalVehicles,
      avgDuration: Math.round(avgDuration),
      avgOccupancy: Math.round(avgOccupancy * 100) / 100,
      peakDay: peakDayData ? format(new Date(peakDayData.date), 'dd/MM/yyyy') : 'N/A',
      peakHour: `${peakHourIndex}:00 - ${peakHourIndex + 1}:00`
    };
  }
};