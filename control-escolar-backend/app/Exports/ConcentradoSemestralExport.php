<?php

namespace App\Exports;

use App\Alumno;
use App\Plantel;
use App\UAC;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\FromArray;
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
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Events\BeforeSheet;
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Cell\DefaultValueBinder;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Sisec;

class ConcentradoSemestralExport extends DefaultValueBinder implements FromArray, WithHeadings, WithMapping,
    WithColumnFormatting, ShouldAutoSize, WithStyles, WithEvents, WithDrawings, WithCustomValueBinder, WithStrictNullComparison
{

    protected $alumnos;
    protected $asignaturas;
    protected $info;

    public function __construct(array $alumnos, $asignaturas, array $info){
        $this->alumnos = $alumnos;
        $this->asignaturas = $asignaturas;
        $this->info = $info;
    }

    public function array() : array
    {
        return $this->alumnos;
    }

    public function headings(): array
    {
        $headings = [
            'Matrícula',
            'Alumno',
            'Género',
        ];


        for ($i = 0; $i < count($this->asignaturas); $i++) {
            $headings = array_merge($headings, ['P1', 'P2', 'P3', 'Ord', 'Final']);
        }

        return $headings;

    }

    public function map($alumno): array
    {

        $genero = '';
        if($alumno['genero'] == 'Masculino'){
            $genero = 'Hombre';
        }else if($alumno['genero'] == 'Femenino'){
            $genero = 'Mujer';
        }

        $data = [
            $alumno['matricula'],
            $alumno['alumno'],
            $genero,
        ];

        foreach($alumno['materias'] as $materia){
            foreach($materia as $calificacion){
                array_push($data, $calificacion);
            }
        }

        if(!isset($alumno['estadistica'])){
            array_push($data, $alumno['ordinario']);
        }else{
            array_push($data, '');
        }

        if(!isset($alumno['estadistica'])) {
            array_push($data, $alumno['extraordinario']);
        }else{
            array_push($data, '');
        }

        if(!isset($alumno['estadistica']) || $alumno['alumno'] != 'Promedio por materia')
            array_push($data, $alumno['reprobadas']);
        else{
            array_push($data, ' ');
        }

        return $data;

    }

    public function columnFormats(): array
    {
        return [];
    }

    public function styles(Worksheet $sheet)
    {
        $rows = $sheet->getHighestRow();
        $columns = $sheet->getHighestColumn();

        $row = 13;
        //Bordes a todas las celdas de la tabla
        $sheet->getStyle("A{$row}:{$columns}{$rows}")
            ->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

        //Negritas
        for($i = 1; $i < 16; $i++){
            $sheet->getStyle($i)->getFont()->applyFromArray(['bold' => 'true']);
        }

        //Colocar al centro
        $sheet->getStyle($row)->getAlignment()->applyFromArray([
            'horizontal' => 'center',
            'vertical' => 'center',
        ]);
        $sheet->getStyle($row+1)->getAlignment()->applyFromArray([
            'horizontal' => 'center',
            'vertical' => 'center',
        ]);
        $sheet->getStyle($row+2)->getAlignment()->applyFromArray([
            'horizontal' => 'center',
            'vertical' => 'center',
        ]);

        //Color gris del heading de la tabla
        $fila = $row;
        $sheet->getStyle("A{$fila}:{$columns}{$fila}")
            ->getFill()
            ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
            ->getStartColor()
            ->setRGB('DDDDDD');

        $fila = $row+1;
        $sheet->getStyle("A{$fila}:{$columns}{$fila}")
            ->getFill()
            ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
            ->getStartColor()
            ->setRGB('DDDDDD');

        $fila = $row+2;
        $sheet->getStyle("A{$fila}:{$columns}{$fila}")
            ->getFill()
            ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
            ->getStartColor()
            ->setRGB('DDDDDD');

        //Altura de las filas
        $sheet->getRowDimension(1)->setRowHeight(60);
        $sheet->getRowDimension($row)->setRowHeight(80);

        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();

        $styleArray = array(
        'font'  => array(
            'bold'  => true,
            'color' => array('rgb' => 'FF0000'),
        ));

        //Color rojo en reprobados
        $highestColumnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($highestColumn);
        for ($row = 15; $row <= $highestRow-5; ++$row) {
            for($col = 4; $col < $highestColumnIndex-1; $col++){
                $calif = $sheet->getCellByColumnAndRow($col, $row)->getValue();
                if($calif != '' && is_numeric($calif) &&  $calif < 6) {
                    $sheet->getCellByColumnAndRow($col, $row)->getStyle()->applyFromArray($styleArray);
                }
            }
        }

        $columns = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
            'AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','AY','AZ',
            'BA','BB','BC','BD','BE','BF','BG','BH','BI','BJ','BK','BL','BM','BN','BO','BP','BQ','BR','BS','BT','BU','BV','BW','BX','BY','BZ'
        ];

        $col = 3;
        for($i = 0; $i < count($this->asignaturas); $i++){
            $sheet->mergeCells("{$columns[$col]}13:{$columns[$col+4]}13");
            $sheet->mergeCells("{$columns[$col]}14:{$columns[$col+4]}14");
            $col+=5;
        }

        $sheet->mergeCells("{$columns[$col]}13:{$columns[$col]}15");
        $sheet->mergeCells("{$columns[$col+1]}13:{$columns[$col+1]}15");
        $sheet->mergeCells("{$columns[$col+2]}13:{$columns[$col+2]}15");

        //Combinar columnas
        $sheet->mergeCells("A1:C1");
        $sheet->mergeCells("A2:C2");
        $sheet->mergeCells("A3:C3");
        $sheet->mergeCells("A4:C4");
        $sheet->mergeCells("A5:C5");
        $sheet->mergeCells("A6:C6");
        $sheet->mergeCells("A7:C7");
        $sheet->mergeCells("A8:C8");
        $sheet->mergeCells("A9:C9");
        $sheet->mergeCells("A10:C10");

        $sheet->mergeCells("A13:C14");
    }

    public function registerEvents(): array
    {
        return [

            BeforeSheet::class => function(BeforeSheet $event){
                //Añadir filas antes de colocar los datos
                $event->sheet->append([' ']);
                $event->sheet->append(['CONCENTRADO SEMESTRAL']);
                $event->sheet->append(['Estado: '.$this->info['estado']]);
                $event->sheet->append(['Plantel: '.$this->info['plantel']]);
                $event->sheet->append(['CCT: '.$this->info['cct']]);
                $event->sheet->append(['Semestre: '.$this->info['semestre'].' Grupo: '.$this->info['grupo']]);
                $event->sheet->append(['Ciclo: '.$this->info['periodo']]);
                $event->sheet->append(['Especialidad: '.$this->info['carrera']]);
                $event->sheet->append(['Promedio grupo (Sin submódulos): '.$this->info['promedio']]);

                $event->sheet->append(['Fecha: '. Carbon::now()->format('d-m-Y')]);
                $event->sheet->append([' ']);
                $event->sheet->append([' ']);

                $nombres = ['', '', ''];
                $claves = ['', '', ''];

                foreach($this->asignaturas as $asignatura){
                    array_push($nombres, $asignatura->nombre);
                    array_push($claves, $asignatura->clave_uac);
                    for($i = 0; $i < 4; $i++){
                        array_push($nombres, '');
                        array_push($claves, '');
                    }

                }
                $nombres = array_merge($nombres, ['PROM ORD', 'PROM FINAL', 'MR']);

                $event->sheet->append($nombres);
                $event->sheet->append($claves);

            },
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getDelegate()->getStyle('D13:ZZ13')
                    ->getAlignment()->setWrapText(true);
            }
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

    public function bindValue(Cell $cell, $value)
    {
        if (is_numeric($value) && $cell->getColumn() == "A") {
            $cell->setValueExplicit($value, DataType::TYPE_STRING);
            return true;
        }

        // else return default behavior
        return parent::bindValue($cell, $value);
    }

}
