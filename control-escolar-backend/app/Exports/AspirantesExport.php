<?php

namespace App\Exports;

use App\Alumno;
use App\Aspirante;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;
use Maatwebsite\Excel\Concerns\WithDrawings;
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
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Sisec;

class AspirantesExport implements FromCollection, WithHeadings, WithMapping,
    ShouldAutoSize, WithStyles, WithEvents, WithDrawings
{

    protected $fechaInicio;
    protected $fechaFin;
    protected $plantelId;

    public function __construct($fechaInicio, $fechaFin, $plantelId = null){
        $this->fechaInicio = $fechaInicio;
        $this->fechaFin = $fechaFin;
        $this->plantelId = $plantelId;
    }

    public function collection()
    {

        $aspirantes = Aspirante::whereBetween('fecha_alta', [$this->fechaInicio, $this->fechaFin]);

        if($this->plantelId){
            $aspirantes->where('plantel_id', $this->plantelId);
        }

        $aspirantes->orderBy('fecha_alta', 'ASC')->with('plantel', 'carrera');

        return $aspirantes->get();
    }

    public function headings(): array
    {
        return [
            'Fecha alta',
            'Nombre(s)',
            'Primer apellido',
            'Segundo Apellido',
            'CURP',
            'Fecha de Nacimiento',
            'Correo',
            'Teléfono',
            'Domicilio',
            'Plantel',
            'Carrera'
        ];
    }

    public function map($aspirante): array
    {
        return [
            Carbon::parse($aspirante->fecha_alta)->format('d-m-Y'),
            $aspirante->nombre,
            $aspirante->primer_apellido,
            $aspirante->segundo_apellido,
            $aspirante->curp,
            $aspirante->fecha_nacimiento,
            $aspirante->correo,
            $aspirante->telefono,
            $aspirante->domicilio,
            $aspirante->plantel->nombre ?? '',
            $aspirante->carrera->nombre ?? '',
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
        $sheet->getStyle('4')->getFont()->applyFromArray(['bold' => 'true']);
        $sheet->getStyle('4')->getAlignment()->applyFromArray(['horizontal' => 'center']);

        //Color gris del heading de la tabla
        $sheet->getStyle("A4:{$columns}4")
            ->getFill()
            ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
            ->getStartColor()
            ->setRGB('DDDDDD');

        //Altura de las filas
        $sheet->getRowDimension(1)->setRowHeight(60);

        //Combinar columnas
        $sheet->mergeCells("A1:{$columns}1");
        $sheet->mergeCells("A2:{$columns}2");
        $sheet->mergeCells("A3:{$columns}3");

    }

    public function registerEvents(): array
    {
        return [

            BeforeSheet::class => function(BeforeSheet $event){
                //Añadir filas antes de colocar los datos
                $event->sheet->append([' ']);
                $event->sheet->append(['REPORTE DE ASPIRANTES DE '.$this->fechaInicio->format('d-m-Y').' AL '.$this->fechaFin->format('d-m-Y')]);
                $event->sheet->append(['Fecha: '. Carbon::now()->format('d-m-Y')]);
            },

        ];
    }

    /**
     * @inheritDoc
     */
    public function drawings()
    {
        $img = '/assets/logos-estados/logo-cecyte.png';

        $sep = new Drawing();
        $sep->setName('Logo SEP');
        $sep->setDescription('Logo de la SEP');
        $sep->setPath(public_path('/assets/logo-sep.jpg'));
        $sep->setWidth(150);
        $sep->setOffsetY(10);
        $sep->setOffsetX(20);
        $sep->setCoordinates('F1');

        $cecyte = new Drawing();
        $cecyte->setName('Logo Cecyte');
        $cecyte->setDescription('Logo de cecyte');
        $cecyte->setPath(public_path($img));
        $cecyte->setWidth(150);
        $cecyte->setOffsetX(20);
        $cecyte->setOffsetY(10);
        $cecyte->setCoordinates('A1');

        return [$sep, $cecyte];

    }

    public function columnWidths(): array
    {
        return [
            'A' => 30,
            'B' => 30,
            'C' => 30
        ];
    }

}
