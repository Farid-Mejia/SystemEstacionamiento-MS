import React, { useState, useEffect, useRef } from 'react';
import { Calendar, BarChart3, TrendingUp, Clock, Users, Download, ChevronDown, FileSpreadsheet, FileText, File } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Layout } from '@/components/Layout';
import { reportService, DailyStats, MonthlyStats, ReportSummary } from '../services/reportService';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    start: '2024-11-01', // Ajustado para incluir los datos generados desde noviembre 2024
    end: '2025-11-02', // Ajustado para incluir los datos hasta noviembre 2025
  });
  const [viewType, setViewType] = useState<'daily' | 'monthly'>('daily');
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allData, setAllData] = useState<any[]>([]);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // Cargar datos una sola vez al montar el componente
  useEffect(() => {
    loadInitialData();
  }, []);

  // Procesar datos localmente cuando cambie el rango de fechas
  useEffect(() => {
    if (allData.length > 0) {
      processLocalData();
    }
  }, [dateRange]); // Removido allData de las dependencias para evitar bucles

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setIsExportDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cargar todos los datos una sola vez al inicio
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Cargando datos iniciales una sola vez...');

      // Obtener todos los datos históricos sin filtro de fechas
      const historicalData = await reportService.getAllHistoricalRecords();
      setAllData(historicalData);

      // Procesar datos para el rango actual
      processLocalData(historicalData);
    } catch (error) {
      console.error('Error loading initial data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

      if (errorMessage.includes('backend') || errorMessage.includes('servidor')) {
        toast.error('No se puede conectar con el servidor. Verifique que el backend esté funcionando.');
      } else if (errorMessage.includes('base de datos') || errorMessage.includes('datos')) {
        toast.error('Error al acceder a los datos del sistema. Verifique la conexión con la base de datos.');
      } else {
        toast.error(`Error al cargar los datos del reporte: ${errorMessage}`);
      }

      // Limpiar los datos en caso de error
      setDailyStats([]);
      setMonthlyStats([]);
      setSummary({
        totalVehicles: 0,
        avgDuration: 0,
        avgOccupancy: 0,
        peakDay: 'N/A',
        peakHour: 'N/A',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Procesar datos localmente según el rango de fechas seleccionado
  const processLocalData = (data = allData) => {
    try {
      console.log('🔄 Procesando datos localmente para el rango:', dateRange);

      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Incluir todo el día final

      // Filtrar datos por rango de fechas
      const filteredData = data.filter((record) => {
        const recordDate = new Date(record.entryTime);
        return recordDate >= startDate && recordDate <= endDate;
      });

      console.log('📊 Registros filtrados:', filteredData.length);

      // Procesar estadísticas diarias localmente
      const dailyGroups = new Map<string, any[]>();
      filteredData.forEach((record) => {
        const dateKey = format(new Date(record.entryTime), 'yyyy-MM-dd');
        if (!dailyGroups.has(dateKey)) {
          dailyGroups.set(dateKey, []);
        }
        dailyGroups.get(dateKey)!.push(record);
      });

      const dailyData = Array.from(dailyGroups.entries())
        .map(([date, dayRecords]) => {
          const avgDuration = dayRecords.reduce((sum, record) => sum + record.duration, 0) / dayRecords.length;
          const occupancyRate = Math.min((dayRecords.length / 40) * 100, 100);

          return {
            date,
            vehicles: dayRecords.length,
            avgDuration: Math.round(avgDuration),
            occupancyRate: Math.round(occupancyRate * 100) / 100,
          };
        })
        .sort((a, b) => a.date.localeCompare(b.date));

      // Procesar estadísticas mensuales localmente
      const monthlyGroups = new Map<string, any[]>();
      filteredData.forEach((record) => {
        const monthKey = format(new Date(record.entryTime), 'yyyy-MM');
        if (!monthlyGroups.has(monthKey)) {
          monthlyGroups.set(monthKey, []);
        }
        monthlyGroups.get(monthKey)!.push(record);
      });

      const monthlyData = Array.from(monthlyGroups.entries())
        .map(([month, monthRecords]) => {
          const avgDuration = monthRecords.reduce((sum, record) => sum + record.duration, 0) / monthRecords.length;
          const daysInMonth = new Date(parseInt(month.split('-')[0]), parseInt(month.split('-')[1]), 0).getDate();
          const occupancyRate = (monthRecords.length / (40 * daysInMonth)) * 100;

          return {
            month: format(new Date(month + '-01'), 'MMMM yyyy', { locale: es }),
            vehicles: monthRecords.length,
            avgDuration: Math.round(avgDuration),
            occupancyRate: Math.round(occupancyRate * 100) / 100,
          };
        })
        .sort((a, b) => a.month.localeCompare(b.month));

      // Calcular resumen localmente
      let summaryData = {
        totalVehicles: 0,
        avgDuration: 0,
        avgOccupancy: 0,
        peakDay: 'N/A',
        peakHour: 'N/A',
      };

      if (filteredData.length > 0) {
        const totalVehicles = filteredData.length;
        const avgDuration = filteredData.reduce((sum, record) => sum + record.duration, 0) / filteredData.length;

        // Calcular día pico
        const peakDay = dailyData.reduce((max, day) => (day.vehicles > max.vehicles ? day : max), dailyData[0]);

        // Calcular hora pico
        const hourlyGroups = new Map<number, number>();
        filteredData.forEach((record) => {
          const hour = new Date(record.entryTime).getHours();
          hourlyGroups.set(hour, (hourlyGroups.get(hour) || 0) + 1);
        });

        const peakHour = Array.from(hourlyGroups.entries()).reduce((max, [hour, count]) => (count > max[1] ? [hour, count] : max), [0, 0])[0];

        const avgOccupancy = dailyData.reduce((sum, day) => sum + day.occupancyRate, 0) / dailyData.length;

        summaryData = {
          totalVehicles,
          avgDuration: Math.round(avgDuration),
          avgOccupancy: Math.round(avgOccupancy * 100) / 100,
          peakDay: peakDay ? format(new Date(peakDay.date), 'dd/MM/yyyy') : 'N/A',
          peakHour: `${peakHour}:00`,
        };
      }

      // Actualizar estados
      setDailyStats(dailyData);
      setMonthlyStats(monthlyData);
      setSummary(summaryData);

      console.log('✅ Datos procesados localmente');
      console.log('📊 Daily stats:', dailyData.length, 'registros');
      console.log('📊 Monthly stats:', monthlyData.length, 'registros');
      console.log('📊 Summary:', summaryData);
    } catch (error) {
      console.error('Error processing local data:', error);
      toast.error('Error al procesar los datos localmente');
    }
  };

  // Generar datos para gráfico de distribución por horas
  const getHourlyDistribution = () => {
    if (!allData.length) return [];

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);

    const filteredData = allData.filter((record) => {
      const recordDate = new Date(record.entryTime);
      return recordDate >= startDate && recordDate <= endDate;
    });

    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      vehicles: 0,
    }));

    filteredData.forEach((record) => {
      const hour = new Date(record.entryTime).getHours();
      hourlyData[hour].vehicles++;
    });

    return hourlyData;
  };

  // Generar datos para gráfico de distribución por pisos
  const getFloorDistribution = () => {
    if (!allData.length) return [];

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);

    const filteredData = allData.filter((record) => {
      const recordDate = new Date(record.entryTime);
      return recordDate >= startDate && recordDate <= endDate;
    });

    // Solo considerar pisos 1 y 2
    const floorCounts: { [key: string]: number } = {
      'Piso 1': 0,
      'Piso 2': 0,
    };

    filteredData.forEach((record) => {
      // Asignar aleatoriamente a piso 1 o 2 si no hay información de piso
      // o mapear el piso existente a solo 2 pisos
      let floor = 'Piso 1';
      if (record.floor) {
        const floorNum = parseInt(record.floor.toString());
        if (floorNum > 2) {
          floor = 'Piso 2'; // Mapear pisos superiores al piso 2
        } else if (floorNum === 2) {
          floor = 'Piso 2';
        } else {
          floor = 'Piso 1';
        }
      } else {
        // Si no hay información de piso, distribuir basado en el ID del registro
        floor = record.id % 2 === 0 ? 'Piso 1' : 'Piso 2';
      }

      floorCounts[floor] = (floorCounts[floor] || 0) + 1;
    });

    return Object.entries(floorCounts).map(([floor, count]) => ({
      name: floor,
      value: count,
      percentage: ((count / filteredData.length) * 100).toFixed(1),
    }));
  };

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const setQuickRange = (months: number) => {
    const end = new Date();
    const start = subMonths(end, months);
    setDateRange({
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const generateFileName = (format: string) => {
    const startDate = dateRange.start.replace(/-/g, '');
    const endDate = dateRange.end.replace(/-/g, '');
    return `Reporte_Estacionamiento_${startDate}_${endDate}.${format}`;
  };

  const exportToExcel = async () => {
    try {
      setIsExporting(true);

      const workbook = XLSX.utils.book_new();

      // Hoja de resumen
      const summaryData = [['REPORTE DE ESTACIONAMIENTO - PARKSYSTEM'], [''], ['Período:', `${format(new Date(dateRange.start), 'dd/MM/yyyy')} - ${format(new Date(dateRange.end), 'dd/MM/yyyy')}`], ['Generado:', format(new Date(), 'dd/MM/yyyy HH:mm')], [''], ['RESUMEN EJECUTIVO'], ['Total de Vehículos:', summary?.totalVehicles || 0], ['Tiempo Promedio:', formatDuration(summary?.avgDuration || 0)], ['Ocupación Promedio:', `${summary?.avgOccupancy.toFixed(1)}%` || '0%'], ['Día con más actividad:', summary?.peakDay || 'N/A'], ['Hora pico:', summary?.peakHour || 'N/A']];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');

      // Hoja de datos diarios
      if (dailyStats.length > 0) {
        const dailyData = [['Fecha', 'Vehículos', 'Duración Promedio (min)', 'Ocupación (%)'], ...dailyStats.map((stat) => [format(new Date(stat.date), 'dd/MM/yyyy'), stat.vehicles, stat.avgDuration, stat.occupancyRate.toFixed(1)])];

        const dailySheet = XLSX.utils.aoa_to_sheet(dailyData);
        XLSX.utils.book_append_sheet(workbook, dailySheet, 'Datos Diarios');
      }

      // Hoja de datos mensuales
      if (monthlyStats.length > 0) {
        const monthlyData = [['Mes', 'Vehículos', 'Duración Promedio (min)', 'Ocupación (%)'], ...monthlyStats.map((stat) => [stat.month, stat.vehicles, stat.avgDuration, stat.occupancyRate.toFixed(1)])];

        const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData);
        XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Datos Mensuales');
      }

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, generateFileName('xlsx'));

      toast.success('Reporte exportado a Excel exitosamente');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Error al exportar a Excel');
    } finally {
      setIsExporting(false);
      setIsExportDropdownOpen(false);
    }
  };

  const exportToCSV = async () => {
    try {
      setIsExporting(true);

      const currentStats = viewType === 'daily' ? dailyStats : monthlyStats;
      const headers = viewType === 'daily' ? ['Fecha', 'Vehículos', 'Duración Promedio (min)', 'Ocupación (%)'] : ['Mes', 'Vehículos', 'Duración Promedio (min)', 'Ocupación (%)'];

      const csvContent = [`REPORTE DE ESTACIONAMIENTO - PARKSYSTEM`, `Período: ${format(new Date(dateRange.start), 'dd/MM/yyyy')} - ${format(new Date(dateRange.end), 'dd/MM/yyyy')}`, `Generado: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, '', `RESUMEN EJECUTIVO`, `Total de Vehículos,${summary?.totalVehicles || 0}`, `Tiempo Promedio,${formatDuration(summary?.avgDuration || 0)}`, `Ocupación Promedio,${summary?.avgOccupancy.toFixed(1)}%`, `Día con más actividad,${summary?.peakDay || 'N/A'}`, `Hora pico,${summary?.peakHour || 'N/A'}`, '', headers.join(','), ...currentStats.map((stat) => [viewType === 'daily' ? format(new Date(stat.date), 'dd/MM/yyyy') : stat.month, stat.vehicles, stat.avgDuration, stat.occupancyRate.toFixed(1)].join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, generateFileName('csv'));

      toast.success('Reporte exportado a CSV exitosamente');
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast.error('Error al exportar a CSV');
    } finally {
      setIsExporting(false);
      setIsExportDropdownOpen(false);
    }
  };

  const exportToPDF = async () => {
    try {
      setIsExporting(true);

      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(59, 130, 246); // Blue color
      doc.text('REPORTE DE ESTACIONAMIENTO', 20, 25);
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('ParkSystem', 20, 35);

      // Date range
      doc.setFontSize(12);
      doc.text(`Período: ${format(new Date(dateRange.start), 'dd/MM/yyyy')} - ${format(new Date(dateRange.end), 'dd/MM/yyyy')}`, 20, 50);
      doc.text(`Generado: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 20, 60);

      // Summary section
      doc.setFontSize(14);
      doc.setTextColor(59, 130, 246);
      doc.text('RESUMEN EJECUTIVO', 20, 80);

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const summaryY = 95;
      doc.text(`Total de Vehículos: ${summary?.totalVehicles || 0}`, 20, summaryY);
      doc.text(`Tiempo Promedio: ${formatDuration(summary?.avgDuration || 0)}`, 20, summaryY + 10);
      doc.text(`Ocupación Promedio: ${summary?.avgOccupancy.toFixed(1)}%`, 20, summaryY + 20);
      doc.text(`Día con más actividad: ${summary?.peakDay || 'N/A'}`, 20, summaryY + 30);
      doc.text(`Hora pico: ${summary?.peakHour || 'N/A'}`, 20, summaryY + 40);

      // Data table
      const currentStats = viewType === 'daily' ? dailyStats : monthlyStats;
      const tableHeaders = viewType === 'daily' ? ['Fecha', 'Vehículos', 'Duración Promedio (min)', 'Ocupación (%)'] : ['Mes', 'Vehículos', 'Duración Promedio (min)', 'Ocupación (%)'];

      const tableData = currentStats.map((stat) => [viewType === 'daily' ? format(new Date(stat.date), 'dd/MM/yyyy') : stat.month, stat.vehicles.toString(), stat.avgDuration.toString(), `${stat.occupancyRate.toFixed(1)}%`]);

      (doc as any).autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: 150,
        theme: 'grid',
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 9,
        },
        margin: { left: 20, right: 20 },
      });

      doc.save(generateFileName('pdf'));

      toast.success('Reporte exportado a PDF exitosamente');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Error al exportar a PDF');
    } finally {
      setIsExporting(false);
      setIsExportDropdownOpen(false);
    }
  };

  const currentStats = viewType === 'daily' ? dailyStats : monthlyStats;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h1>
            <p className="text-gray-600">Análisis histórico del sistema de estacionamiento</p>
          </div>
          <div className="relative" ref={exportDropdownRef}>
            <button onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)} disabled={isExporting} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Download className="w-4 h-4" />
              {isExporting ? 'Exportando...' : 'Exportar Reporte'}
              <ChevronDown className={`w-4 h-4 transition-transform ${isExportDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isExportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button onClick={exportToExcel} className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors">
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    <span>Exportar a Excel</span>
                  </button>
                  <button onClick={exportToCSV} className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Exportar a CSV</span>
                  </button>
                  <button onClick={exportToPDF} className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors">
                    <File className="w-4 h-4 text-red-600" />
                    <span>Exportar a PDF</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700">Período:</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Desde:</label>
                <input type="date" value={dateRange.start} onChange={(e) => handleDateChange('start', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Hasta:</label>
                <input type="date" value={dateRange.end} onChange={(e) => handleDateChange('end', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setQuickRange(1)} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Último mes
              </button>
              <button onClick={() => setQuickRange(3)} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                3 meses
              </button>
              <button onClick={() => setQuickRange(6)} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                6 meses
              </button>
            </div>
          </div>
        </div>

        {/* Resumen de KPIs Mejorado - 4 columnas */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Vehículos</p>
                  <p className="text-3xl font-bold text-blue-900">{summary.totalVehicles.toLocaleString()}</p>
                  <p className="text-xs text-blue-600 mt-1">En el período seleccionado</p>
                </div>
                <div className="p-4 bg-blue-200 rounded-xl shadow-sm">
                  <Users className="w-7 h-7 text-blue-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">Tiempo Promedio</p>
                  <p className="text-3xl font-bold text-green-900">{formatDuration(summary.avgDuration)}</p>
                  <p className="text-xs text-green-600 mt-1">Duración de estancia</p>
                </div>
                <div className="p-4 bg-green-200 rounded-xl shadow-sm">
                  <Clock className="w-7 h-7 text-green-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">Ocupación Promedio</p>
                  <p className="text-3xl font-bold text-purple-900">{summary.avgOccupancy.toFixed(1)}%</p>
                  <p className="text-xs text-purple-600 mt-1">Tasa de ocupación</p>
                </div>
                <div className="p-4 bg-purple-200 rounded-xl shadow-sm">
                  <TrendingUp className="w-7 h-7 text-purple-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700 mb-1">Promedio Diario</p>
                  <p className="text-3xl font-bold text-orange-900">{dailyStats.length > 0 ? Math.round(summary.totalVehicles / dailyStats.length) : 0}</p>
                  <p className="text-xs text-orange-600 mt-1">Vehículos por día</p>
                </div>
                <div className="p-4 bg-orange-200 rounded-xl shadow-sm">
                  <BarChart3 className="w-7 h-7 text-orange-700" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-xl shadow-sm border border-indigo-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-indigo-900">Información Destacada</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-indigo-100 hover:bg-white/90 transition-all duration-200">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-700">Día con más actividad</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-900 bg-indigo-100 px-3 py-1 rounded-full">{summary.peakDay}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-cyan-100 hover:bg-white/90 transition-all duration-200">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-700">Hora pico</span>
                  </div>
                  <span className="text-sm font-bold text-cyan-900 bg-cyan-100 px-3 py-1 rounded-full">{summary.peakHour}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-green-100 hover:bg-white/90 transition-all duration-200">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-700">Capacidad total</span>
                  </div>
                  <span className="text-sm font-bold text-green-900 bg-green-100 px-3 py-1 rounded-full">80 espacios</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-purple-100 hover:bg-white/90 transition-all duration-200">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-700">Pisos disponibles</span>
                  </div>
                  <span className="text-sm font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-full">2 pisos</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Vista de Datos</h3>
              </div>
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button onClick={() => setViewType('daily')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewType === 'daily' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                  Por Día
                </button>
                <button onClick={() => setViewType('monthly')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewType === 'monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                  Por Mes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gráficos Mejorados - 4 gráficos en grid de 2x2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Vehículos por Período */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-200 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900">Vehículos por {viewType === 'daily' ? 'Día' : 'Mes'}</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentStats}>
                  <defs>
                    <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey={viewType === 'daily' ? 'date' : 'month'} tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [value, 'Vehículos']}
                    labelFormatter={(label) => (viewType === 'daily' ? format(new Date(label), 'dd/MM/yyyy') : label)}
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Area type="monotone" dataKey="vehicles" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorVehicles)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Duración Promedio */}
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-200 rounded-lg">
                <Clock className="w-5 h-5 text-green-700" />
              </div>
              <h3 className="text-lg font-semibold text-green-900">Duración Promedio</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey={viewType === 'daily' ? 'date' : 'month'} tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} min`, 'Duración']}
                    labelFormatter={(label) => (viewType === 'daily' ? format(new Date(label), 'dd/MM/yyyy') : label)}
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="avgDuration" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Distribución por Horas */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl shadow-sm border border-orange-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-200 rounded-lg">
                <Clock className="w-5 h-5 text-orange-700" />
              </div>
              <h3 className="text-lg font-semibold text-orange-900">Distribución por Horas</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getHourlyDistribution()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [value, 'Vehículos']}
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="vehicles" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Distribución por Pisos */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-700" />
              </div>
              <h3 className="text-lg font-semibold text-purple-900">Distribución por Pisos</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={getFloorDistribution()} cx="50%" cy="50%" labelLine={false} label={({ name, percentage }) => `${name}: ${percentage}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {getFloorDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#8B5CF6' : index === 1 ? '#06B6D4' : '#10B981'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, 'Vehículos']}
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
