<?php

namespace App\Exports;

use App\Alumno;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Events\BeforeSheet;
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Sisec;

class AlumnosExport implements FromCollection, WithHeadings, WithMapping,
    WithColumnFormatting, ShouldAutoSize, WithStyles, WithEvents
{

    protected $idAlumnos;
    protected $headers;

    public function __construct(array $ids, array $headers){
        $this->idAlumnos = $ids;
        $this->headers = $headers;
    }

    public function collection()
    {
        $periodoActual = Sisec::periodoActual();

        $alumnos = Alumno::whereIn('usuario_id', $this->idAlumnos)
            ->with(['usuario', 'carrera', 'plantel', 'expediente',
            'grupos' => function ($query) use ($periodoActual) {
                $query->where('periodo_id', $periodoActual->id);
            }])->get();

        $alumnos = $alumnos->sortBy(function($alumno){
           return Str::upper(iconv('UTF-8', 'ASCII//TRANSLIT', $alumno->usuario->primer_apellido));
        });

        return $alumnos;
    }

    public function headings(): array
    {
        return $this->headers;
    }

    public function map($alumno): array
    {
        $data =  [
            $alumno->usuario->primer_apellido,
            $alumno->usuario->segundo_apellido,
            $alumno->usuario->nombre,
            $alumno->usuario->username,
            $alumno->matricula,
            $alumno->plantel->nombre ?? '',
            $alumno->carrera->nombre ?? '',
            $alumno->semestre,
            $alumno->grupos->first()->grupo ?? '',
        ];

        if(in_array('Teléfono', $this->headers)){
            array_push($data, $alumno->numero_contacto.' '.$alumno->numero_movil);
        }

        if(in_array('Domicilio', $this->headers)){
            array_push($data,  $alumno->direccion.' CP: '.$alumno->codigo_postal);
        }

        if(in_array('Fecha de Nacimiento', $this->headers)){
            $fecha = $alumno->expediente->fecha_nacimiento ?? '';
            if($fecha != ''){
                $fecha = Carbon::parse($fecha)->format('d-m-Y');
            }
            array_push($data, $fecha);
        }

        if(in_array('Email', $this->headers)){
            array_push($data, $alumno->usuario->email);
        }

        if(in_array('Sexo', $this->headers)){
            $sexo = '';
            if($alumno->genero == 'M'){
                $sexo = 'Mujer';
            }else if($alumno->genero == 'H'){
                $sexo = 'Hombre';
            }
            array_push($data, $sexo);
        }

        return $data;

    }

    public function columnFormats(): array
    {
        return [
            'E' => NumberFormat::FORMAT_NUMBER,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $rows = $sheet->getHighestRow();
        $columns = $sheet->getHighestColumn();

        //Bordes a todas las celdas de la tabla
        $sheet->getStyle("A1:{$columns}{$rows}")
            ->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

        //Estilos en negritas y alineación
        $sheet->getStyle('1')->getFont()->applyFromArray(['bold' => 'true']);
        $sheet->getStyle('2')->getFont()->applyFromArray(['bold' => 'true']);
        $sheet->getStyle('3')->getFont()->applyFromArray(['bold' => 'true']);
        $sheet->getStyle('3')->getAlignment()->applyFromArray(['horizontal' => 'center']);

        //Color gris del heading de la tabla
        $sheet->getStyle("A3:{$columns}6")
            ->getFill()
            ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
            ->getStartColor()
            ->setARGB('DDDDDD');

        //Combinar columnas
        $sheet->mergeCells("A1:{$columns}1");
        $sheet->mergeCells("A2:{$columns}2");
    }

    public function registerEvents(): array
    {
        return [

            BeforeSheet::class => function(BeforeSheet $event){
                //Añadir filas antes de colocar los datos
                $event->sheet->append(['REPORTE DE ALUMNOS']);
                $event->sheet->append(['Fecha: '. Carbon::now()->format('d-m-Y')]);
            },

            AfterSheet::class => function (AfterSheet $event) {

                //Inmovilizar filas
                $event->sheet->getDelegate()->freezePane('A1');
                $event->sheet->getDelegate()->freezePane('A2');
                $event->sheet->getDelegate()->freezePane('A3');
                $event->sheet->getDelegate()->freezePane('A4');

            },

        ];
    }
}
