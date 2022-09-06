package mx.edu.cecyte.sisec.business;

import mx.edu.cecyte.sisec.classes.degree.ExcelRowDegree;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.*;
import org.springframework.util.StringUtils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class MetFunctions {
    public static List<ExcelRowDegree> getResultsFromExcelFile(byte[] excelBytes) {
        ByteArrayInputStream bais = new ByteArrayInputStream(excelBytes);
        List<ExcelRowDegree> result = new ArrayList<>();
        try {
            Workbook workbook = WorkbookFactory.create(bais);
            for (Sheet sheet : workbook) {
                DataFormatter dataFormatter = new DataFormatter();
                int fileCount = 1;
                for (Row row : sheet) {
                    if (1 == fileCount++) continue;
                    ExcelRowDegree excelRow = getExcelRow(dataFormatter, row);
                    result.add(excelRow);
                }
            }
            workbook.close();
        } catch (InvalidFormatException | IOException e) {
            throw new AppException(Messages.mec_cantReadExcel);
        }
        return result;
    }

    private static ExcelRowDegree getExcelRow(DataFormatter dataFormatter, Row row) {
        String nombreArchivo = dataFormatter.formatCellValue(row.getCell(0));
        String estatus = dataFormatter.formatCellValue(row.getCell(1));
        String mensaje = dataFormatter.formatCellValue(row.getCell(2));
        String folio = dataFormatter.formatCellValue(row.getCell(3));
        return new ExcelRowDegree(nombreArchivo, Integer.valueOf(estatus), mensaje, folio);
    }

    public static String concatToOriginalString(Object o) {
        if (o == null) return "|";
        String string = o.toString();
        if (StringUtils.isEmpty(o)) {
            return "|";
        }
        return String.format("%s|", string.trim().replace("|", ""));
    }
}
