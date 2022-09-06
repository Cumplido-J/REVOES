package mx.edu.cecyte.sisec.shared;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.core.appender.AppenderLoggingException;

import javax.xml.datatype.XMLGregorianCalendar;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public class AppFunctions {
    private static final String[] MONTHS = {"enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"};
    private static final String[] DAYS = {"primer", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
            "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve",
            "veinte", "veintiún", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis",
            "veintisiete", "veintiocho", "veintinueve", "treinta", "treinta",};
    public static final String[] ORDINALS = {"Primer", "Segundo", "Tercer", "Cuarto", "Quinto", "Sexto"};

    public static boolean positiveInteger(Integer number) {
        return number != null && number > 0;
    }

    public static byte[] generateQr(String qrContent) {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        hints.put(EncodeHintType.MARGIN, 0);
        try {
            BitMatrix bitMatrix = qrCodeWriter.encode(qrContent, BarcodeFormat.QR_CODE, 500, 500, hints);
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", baos);
        } catch (WriterException | IOException e) {
            throw new AppenderLoggingException("No se ha podido generar el codigo QR.");
        }
        return baos.toByteArray();
    }

    public static String splitTextOnLines(String longText, int lines) {
        List<String> result = new ArrayList<>();

        String[] wordList = longText.split(" ");

        int wordsCount = wordList.length;
        int wordsPerLine = wordsCount / lines;
        int remainder = wordsCount % lines;

        for (int i = 0; i < wordsCount; ) {
            List<String> wordsInLine = new ArrayList<>();
            for (int j = 0; j < wordsPerLine && i < wordsCount; j++, i++) {
                wordsInLine.add(wordList[wordsCount - 1 - i]);
            }
            if (remainder > 0) {
                wordsInLine.add(wordList[wordsCount - 1 - i]);
                i++;
                remainder--;
            }
            Collections.reverse(wordsInLine);
            result.add(String.join(" ", wordsInLine));
        }
        Collections.reverse(result);
        return String.join(System.lineSeparator(), result);
    }

    public static String xmlDateToLetterDate(String fecha) {
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
        try {
            Date date = inputFormat.parse(fecha);
            Calendar gregorianCalendar = new GregorianCalendar();
            gregorianCalendar.setTime(date);
            return calendarToLetterDate(gregorianCalendar);
        } catch (ParseException e) {
            throw new AppException(Messages.appFunctions_xmlDateWrongFormat);
        }
    }

    private static String calendarToLetterDate(Calendar calendar) {
        String dia = String.valueOf(calendar.get(Calendar.DAY_OF_MONTH));
        String mes = MONTHS[calendar.get(Calendar.MONTH)];
        String anio = String.valueOf(calendar.get(Calendar.YEAR));
        if (dia.length() == 1) dia = String.format("0%s", dia);
        return String.format("%s de %s de %s", dia, mes, anio);
    }

    public static String fullName(String name, String firstLastName, String secondLastName) {
        return String.format("%s %s%s", name, firstLastName, StringUtils.isBlank(secondLastName) ? "" : " " + secondLastName);
    }

    public static String xmlDateToPrintDate(XMLGregorianCalendar fechaSep) {
        Calendar calendar = fechaSep.toGregorianCalendar();
        int day = calendar.get(Calendar.DAY_OF_MONTH);
        String letterDay = DAYS[day - 1];
        String month = MONTHS[calendar.get(Calendar.MONTH)];
        Integer year = calendar.get(Calendar.YEAR);
        if (day == 1) {
            return String.format("al primer día del mes de %s de %s", month, year);
        }
        return String.format("a los %s días del mes de %s de %s", letterDay, month, year);
    }

    public static String xmlDateToSepDate(XMLGregorianCalendar fechaSep) {
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
        String fechaString = fechaSep.toString();
        Date date;
        try {
            date = inputFormat.parse(fechaString);
        } catch (ParseException e) {
            throw new AppException(Messages.appFunctions_xmlDateWrongFormat);
        }
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        return simpleDateFormat.format(date);
    }

    public static String dateToLetterDate(Date date) {
        if (date == null) return null;
        Calendar gregorianCalendar = new GregorianCalendar();
        gregorianCalendar.setTime(date);
        return calendarToLetterDate(gregorianCalendar);
    }

    public static String firstLetterUpperCase(String string) {
        return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
    }

    public static String fullNameToPascalCase(String fullName) {
        String[] nameConnectosArray = {"el", "los", "la", "las", "de", "del"};
        List<String> nameConnectors = Arrays.asList(nameConnectosArray);

        String[] words = fullName.split(" ");
        List<String> newWords = new ArrayList<>();
        for (String word : words) {
            if (nameConnectors.contains(word)) newWords.add(word.toLowerCase());
            else newWords.add(firstLetterUpperCase(word));
        }
        return String.join(" ", newWords);
    }

    public static String getGenreFromCurp(String curp) {
        if (curp.charAt(11) == 'M') return "Mujer";
        if (curp.charAt(11) == 'H') return "Hombre";
        return "Indefinido";
    }

    public static String createCertificateFolio(String username) {
        String date = new SimpleDateFormat("dd_MM_yyyy_HH_mm_ss").format(new Date());
        return String.format("%s_%s", username, date);
    }

    public static String createCertificateZipName(String username) {
        String date = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        return String.format("%s_%s", username, date) + CustomFileExtension.ZIP;
    }

    public static String parseDateToDecStringDate(Date date) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
        return formatter.format(date);
    }

    public static String parseDateToDegStringDate(Date date) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        return formatter.format(date);
    }

    public static Integer getIemsIdByStateId(Integer stateId) {
        if (stateId.equals(1)) return 10014;
        if (stateId.equals(2)) return 10015;
        if (stateId.equals(3)) return 10016;
        if (stateId.equals(4)) return 10017;
        if (stateId.equals(5)) return 10018;
        if (stateId.equals(7)) return 10019;
        if (stateId.equals(8)) return 10020;
        if (stateId.equals(10)) return 10021;
        if (stateId.equals(11)) return 10022;
        if (stateId.equals(12)) return 10023;
        if (stateId.equals(13)) return 10024;
        if (stateId.equals(14)) return 10025;
        if (stateId.equals(15)) return 10026;
        if (stateId.equals(16)) return 10027;
        if (stateId.equals(17)) return 10028;
        if (stateId.equals(18)) return 10029;
        if (stateId.equals(19)) return 10030;
        if (stateId.equals(20)) return 10031;
        if (stateId.equals(21)) return 10032;
        if (stateId.equals(22)) return 10033;
        if (stateId.equals(23)) return 10034;
        if (stateId.equals(24)) return 10035;
        if (stateId.equals(25)) return 10036;
        if (stateId.equals(26)) return 10037;
        if (stateId.equals(27)) return 10038;
        if (stateId.equals(28)) return 10039;
        if (stateId.equals(29)) return 10040;
        if (stateId.equals(30)) return 10041;
        if (stateId.equals(31)) return 10042;
        if (stateId.equals(32)) return 10043;
        return 0;

    }

    public static Integer getEducationalOptionBySchoolTypeId(Integer schoolTypeId) {
        if (schoolTypeId.equals(AppCatalogs.SCHOOLTYPE_CECYTE)) return 1;
        if (schoolTypeId.equals(AppCatalogs.SCHOOLTYPE_EMSAD)) return 11;
        return 0;
    }

    public static String stateIdToFolderName(Integer stateId) {
        if (stateId == 1) return "1. Aguascalientes";
        if (stateId == 2) return "2. Baja California";
        if (stateId == 3) return "3. Baja California Sur";
        if (stateId == 4) return "4. Campeche";
        if (stateId == 5) return "5. Coahuila";
        if (stateId == 6) return "6. Colima";
        if (stateId == 7) return "7. Chiapas";
        if (stateId == 8) return "8. Chihuahua";
        if (stateId == 9) return "9. Ciudad de México";
        if (stateId == 10) return "10. Durango";
        if (stateId == 11) return "11. Guanajuato";
        if (stateId == 12) return "12. Guerrero";
        if (stateId == 13) return "13. Hidalgo";
        if (stateId == 14) return "14. Jalisco";
        if (stateId == 15) return "15. México";
        if (stateId == 16) return "16. Michoacán";
        if (stateId == 17) return "17. Morelos";
        if (stateId == 18) return "18. Nayarit";
        if (stateId == 19) return "19. Nuevo León";
        if (stateId == 20) return "20. Oaxaca";
        if (stateId == 21) return "21. Puebla";
        if (stateId == 22) return "22. Querétaro";
        if (stateId == 23) return "23. Quintana Roo";
        if (stateId == 24) return "24. San Luis Potosí";
        if (stateId == 25) return "25. Sinaloa";
        if (stateId == 26) return "26. Sonora";
        if (stateId == 27) return "27. Tabasco";
        if (stateId == 28) return "28. Tamaulipas";
        if (stateId == 29) return "29. Tlaxcala";
        if (stateId == 30) return "30. Veracruz";
        if (stateId == 31) return "31. Yucatán";
        if (stateId == 32) return "32. Zacatecas";
        return null;
    }

    public static String getSchoolName(String pdfFinalName, String pdfName, String pdfNumber, Integer schoolTypeId) {
        if (pdfFinalName != null) return pdfFinalName;
        if (pdfName == null) throw new AppException(Messages.school_doesntHavePdfName);

        if (schoolTypeId.equals(AppCatalogs.SCHOOLTYPE_CECYTE)) {
            if (!StringUtils.isEmpty(pdfNumber)) return String.format("Plantel No. %s, %s", pdfNumber, pdfName);
            return String.format("Plantel %s", pdfName);
        }
        if (!StringUtils.isEmpty(pdfNumber)) return String.format("No. %s, %s", pdfNumber, pdfName);
        return String.format("%s", pdfName);
    }

    public static String scoreTo1Decimal(Double score) {
        NumberFormat formatter = new DecimalFormat("#0.0");
        String result = formatter.format(score);
        if (result.equalsIgnoreCase("10.0")) result = "10";
        return result;
    }

    private static String numberToLetter(char number) {
        if (number == '1') return "Uno";
        else if (number == '2') return "Dos";
        else if (number == '3') return "Tres";
        else if (number == '4') return "Cuatro";
        else if (number == '5') return "Cinco";
        else if (number == '6') return "Seis";
        else if (number == '7') return "Siete";
        else if (number == '8') return "Ocho";
        else if (number == '9') return "Nueve";
        return "Cero";
    }

    public static String scoreToLetter(Double finalScore) {
        String calificacionString = scoreTo1Decimal(finalScore);
        if (calificacionString.equalsIgnoreCase("10")) return "Diez";
        return String.format("%s punto %s",
                numberToLetter(calificacionString.charAt(0)),
                numberToLetter(calificacionString.charAt(2)).toLowerCase());
    }

    public static String tryParseDouble(String calificacionUAC) {
        try {
            Double score = Double.parseDouble(calificacionUAC);
            return scoreTo1Decimal(score);
        } catch (NumberFormatException e) {
            return calificacionUAC;
        }
    }

    public static String dateLetterDegree(String fecha) {
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date date = inputFormat.parse(fecha);
            Calendar gregorianCalendar = new GregorianCalendar();
            gregorianCalendar.setTime(date);
            return dateParseString(gregorianCalendar);
        } catch (ParseException e) {
            throw new AppException(Messages.appFunctions_xmlDateWrongFormat);
        }
    }

    public static String dateConvertLetter(String fecha) {
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date date = inputFormat.parse(fecha);
            Calendar gregorianCalendar = new GregorianCalendar();
            gregorianCalendar.setTime(date);
            return calendarToStringDegree(gregorianCalendar);
        } catch (ParseException e) {
            throw new AppException(Messages.appFunctions_xmlDateWrongFormat);
        }
    }

    public static String calendarToStringDegree(Calendar calendar) {
        String dia = String.valueOf(calendar.get(Calendar.DAY_OF_MONTH));
        String mes = MONTHS[calendar.get(Calendar.MONTH)];
        String anio = String.valueOf(calendar.get(Calendar.YEAR));
        if (dia.length() == 1) dia = String.format("0%s", dia);
        return String.format("%s de %s de %s", dia, mes, anio);
    }

    public static String dateParseString(Calendar calendar) {
        String[] number = {"primer", "dos", "tres", "cuatro", "cinco", "seis", "siete"
                , "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis"
                , "diecisiete", "dieciocho", "dicinueve", "veinte", "veintiún", "veintidós"
                , "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho"
                , "veintinueve", "treinta", "treinta y un"};
        String dia = String.valueOf(calendar.get(Calendar.DAY_OF_MONTH));
        dia = number[Integer.parseInt(dia) - 1];
        String mes = MONTHS[calendar.get(Calendar.MONTH)];
        //String anio = String.valueOf(calendar.get(Calendar.YEAR));
        String anio = String.valueOf(calendar.get(Calendar.YEAR));
        if (calendar.get(Calendar.DAY_OF_MONTH) == 1) return String.format("al %s día de %s de %s", dia, mes, anio);
        else return String.format("a los %s días de %s de %s", dia, mes, anio);
    }


    public static String dateParseStringAll(XMLGregorianCalendar fechaSep) {
        String[] number = {"primer", "dos", "tres", "cuatro", "cinco", "seis", "siete"
                , "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis"
                , "diecisiete", "dieciocho", "dicinueve", "veinte", "veintiuno", "veintidós"
                , "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho"
                , "veintinueve", "treinta", "treintaiún"};

        Calendar calendar = fechaSep.toGregorianCalendar();
        int day = calendar.get(Calendar.DAY_OF_MONTH);
        String letterDay = DAYS[day - 1];
        String month = MONTHS[calendar.get(Calendar.MONTH)];
        String anio = String.valueOf(calendar.get(Calendar.YEAR));
        String cadena = "";
        String subcad = number[Integer.parseInt(anio.substring(2)) - 1];
        if (anio.substring(0, 2).equals("20")) cadena = "dos mil "+subcad;
        if (day == 1) {
            return String.format("al primer día del mes de %s de %s", month, cadena);
        }
        return String.format("a los %s días del mes de %s de %s", letterDay, month, cadena);
    }

    public static String dateGraduationPeriod(String start, String end) {
        Date startDate = null;
        Date endDate = null;
        try {
            startDate = new SimpleDateFormat("yyyy-MM-dd").parse(start);
            endDate = new SimpleDateFormat("yyyy-MM-dd").parse(end);
        } catch (ParseException e) {
            throw new AppException("Error en la fecha de Secundaria");
        }
        Calendar calendarS = Calendar.getInstance();
        Calendar calendarE = Calendar.getInstance();
        calendarS.setTime(startDate);
        calendarE.setTime(endDate);
        return calendarS.get(Calendar.YEAR) + " - " + calendarE.get(Calendar.YEAR);
    }

    public static String dateOriginPeriod(String startD, String endD) {
        Date startDate = null;
        Date endDate = null;
        try {
            startDate = new SimpleDateFormat("yyyy-MM-dd").parse(startD);
            endDate = new SimpleDateFormat("yyyy-MM-dd").parse(endD);
        } catch (ParseException e) {
            throw new AppException("Error en la Fecha de la carrera cursada");
        }
        Calendar calendarS = Calendar.getInstance();
        Calendar calendarE = Calendar.getInstance();
        calendarS.setTime(startDate);
        calendarE.setTime(endDate);
        return calendarS.get(Calendar.YEAR) + " - " + calendarE.get(Calendar.YEAR);
    }

    public static String createDegreeFolio(String username) {
        String date = new SimpleDateFormat("ddMMyyyy").format(new Date());
        String cadena = UUID.randomUUID().toString();
        return cadena; //String.format("%s-%s", date, cadena);
    }

    public static String returnStateName(Integer stateId) {
        String[] states = {"Aguascaliente", "BajaCalifornia", "BajaCaliforniaSur", "Campeche", "Coahuila",
                "Colima", "Chiapas", "Chihuahua", "Cdmx", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco",
                "Mexico", "Michoacan", "Morelos", "Nayarit", "NuevoLeon", "Oaxaca", "Puebla", "Queretaro",
                "QuintanaRoo", "SanLuis", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz",
                "Yucatan", "Zacatecas"};
        return states[stateId - 1];
    }

    public static String DeleteAcentTextAndUpperCase(String cadena) {
        final String ORIGINAL = "ÁáÉéÍíÓóÚúÑñÜü";
        final String REEMPLAZO = "AaEeIiOoUuNnUu";

        if (cadena == null) {
            return null;
        }
        char[] array = cadena.toCharArray();
        for (int indice = 0; indice < array.length; indice++) {
            int pos = ORIGINAL.indexOf(array[indice]);
            if (pos > -1) {
                array[indice] = REEMPLAZO.charAt(pos);
            }
        }
        return new String(array).toUpperCase();
        //return cadena.toUpperCase(Locale.ROOT);
    }

    public static String getDate() {
        String timeStamp;
        try {
            timeStamp = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(Calendar.getInstance().getTime());
        } catch (Exception e) {
            throw new AppException("Error con la fecha");
        }
        return timeStamp;
    }

    public static boolean setDateTimbrado(String fechaTimbrado, String fechaTermino) {
        boolean isCorrect = false;
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            Date Inicio = setChangeFormatDate(fechaTermino); //dateFormat.parse("20/07/2022 00:00:00");
            Date Cierre = dateFormat.parse("20/07/2023 00:00:00");
            Date dateTamps = dateFormat.parse(fechaTimbrado);
            System.out.println(Inicio+"<--->"+dateTamps);
            if ((dateTamps.after(Inicio) && dateTamps.before(Cierre)) || dateTamps.equals(Inicio) || dateTamps.equals(Cierre)) {
                isCorrect = true;
            }
        } catch (ParseException e) {
            return false;
        }
        return isCorrect;
    }

    public static Date setChangeFormatDate(String fecha) {
        Date fechas = null;
        try {// Change format '2022-01-01' to '01/01/2022 00:00:00'
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            SimpleDateFormat newFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

            Date date1 = dateFormat.parse(fecha);
            dateFormat.applyPattern("dd/MM/yyyy HH:mm:ss");
            fecha = dateFormat.format(date1);
            fechas = newFormat.parse(fecha);

            System.out.println("" + fecha);
        } catch (ParseException e) {
            return fechas;
        }
        return fechas;
    }
    
    public static String emptyCharacterSpecial(String cadena) {
        final String ORIGINAL = "ÁáÉéÍíÓóÚúÑñÜü";
        final String REEMPLAZO = "AaEeIiOoUuNnUu";
        if (cadena == null) {
            return null;
        }
        char[] array = cadena.toCharArray();
        for (int indice = 0; indice < array.length; indice++) {
            int pos = ORIGINAL.indexOf(array[indice]);
            if (pos > -1) {
                array[indice] = REEMPLAZO.charAt(pos);
            }
        }
        return new String(array).toUpperCase()
                .replaceAll("['/!/@/#/$/^/&/%/*/(/)/+/=/-/[/]/\\///{/}/:/</>/?/,/./]", "")
                .replace(" ", "_");
    }

    public static Date parsetStringToDate(String fecha) {

        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyy-MM-dd");

            Date date = dateFormat.parse(fecha);
            return date;
        } catch (ParseException e) {
            throw new AppException("Error en la conversion de la fecha");
        }
    }
}
