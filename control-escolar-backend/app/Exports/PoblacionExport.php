<?php

namespace App\Exports;

use App\Alumno;
use App\Plantel;
use Carbon\Carbon;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
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
use PhpOffice\PhpSpreadsheet\Worksheet\BaseDrawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Sisec;

class PoblacionExport implements WithHeadings, FromArray, ShouldAutoSize, WithStyles, WithEvents, WithDrawings, WithColumnWidths
{

    protected $estadisticas;
    protected $info;

    public function __construct(array $estadisticas, array $info){
        $this->estadisticas = $estadisticas;
        $this->info = $info;
    }

    public function array() : array
    {
        return $this->estadisticas;
    }

    public function headings(): array
    {
        return [
            'Cantidad de Hombres',
            'Cantidad de Mujeres',
            'Total de alumnos'
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
        $sheet->getStyle('5')->getFont()->applyFromArray(['bold' => 'true']);
        $sheet->getStyle('6')->getFont()->applyFromArray(['bold' => 'true']);
        $sheet->getStyle('7')->getFont()->applyFromArray(['bold' => 'true']);
        $sheet->getStyle('8')->getFont()->applyFromArray(['bold' => 'true']);
        $sheet->getStyle('9')->getFont()->applyFromArray(['bold' => 'true']);
        $sheet->getStyle('9')->getAlignment()->applyFromArray(['horizontal' => 'center']);
        $sheet->getStyle('10')->getAlignment()->applyFromArray(['horizontal' => 'center']);

        //Color gris del heading de la tabla
        $sheet->getStyle("A9:{$columns}9")
            ->getFill()
            ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
            ->getStartColor()
            ->setRGB('DDDDDD');

//        $sheet->getStyle("A1:{$columns}1")
//            ->getFill()
//            ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
//            ->getStartColor()
//            ->setRGB('DDDDDD');

        //Altura de las filas
        $sheet->getRowDimension(1)->setRowHeight(60);

        //Combinar columnas
        $sheet->mergeCells("A1:{$columns}1");
        $sheet->mergeCells("A2:{$columns}2");
        $sheet->mergeCells("A3:{$columns}3");
        $sheet->mergeCells("A4:{$columns}4");
        $sheet->mergeCells("A5:{$columns}5");
        $sheet->mergeCells("A6:{$columns}6");
        $sheet->mergeCells("A7:{$columns}7");
        $sheet->mergeCells("A8:{$columns}8");

    }

    public function registerEvents(): array
    {
        return [

            BeforeSheet::class => function(BeforeSheet $event){
                //Añadir filas antes de colocar los datos
                $event->sheet->append([' ']);
                $event->sheet->append(['REPORTE DE POBLACIÓN DE ALUMNOS']);
                $event->sheet->append(['Estado: '.$this->info['estado']]);
                $event->sheet->append(['Plantel: '.$this->info['plantel']]);

                if($this->info['semestre'] != ''){
                    $event->sheet->append(['Semestre: '.$this->info['semestre']]);
                }else{
                    $event->sheet->append(['Semestre: Varios']);
                }
                if($this->info['grupo'] != ''){
                    $event->sheet->append(['Grupo: '.$this->info['grupo']]);
                }else{
                    $event->sheet->append(['Grupo: Varios']);
                }
                if($this->info['carrera'] != ''){
                    $event->sheet->append(['Carrera: '.$this->info['carrera']]);
                }else{
                    $event->sheet->append(['Carrera: Varias']);
                }
                $event->sheet->append(['Fecha: '. Carbon::now()->format('d-m-Y')]);
            },

        ];
    }

    /**
     * @inheritDoc
     */
    public function drawings()
    {

        $plantel = Plantel::find($this->info['plantel_id']);

        if(file_exists(public_path('/assets/logos-estados/'.$plantel->municipio->estado->abreviatura.'.png')))
            $img = '/assets/logos-estados/'.$plantel->municipio->estado->abreviatura.'.png';
        else
            $img = '/assets/logos-estados/logo-cecyte.png';

        $sep = new Drawing();
        $sep->setName('Logo SEP');
        $sep->setDescription('Logo de la SEP');
        $sep->setPath(public_path('/assets/logo-sep.jpg'));
        $sep->setWidth(150);
        $sep->setOffsetY(10);
        $sep->setOffsetX(20);
        $sep->setCoordinates('C1');

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
