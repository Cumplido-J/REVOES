package mx.edu.cecyte.sisec.business;

import mx.edu.cecyte.sisec.classes.CustomFile;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomFileExtension;
import mx.edu.cecyte.sisec.shared.Messages;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.Deflater;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

public class FileFunctions {
    public static void saveFile(Path folderPath, CustomFile customFile) {
        try {
            Files.createDirectories(folderPath);
            Path filePath = Paths.get(folderPath.toString(), customFile.getFileNameWithExtension());
            Files.write(filePath, customFile.getBytes());
        } catch (IOException e) {
            throw new AppException(Messages.file_cantWrite);
        }
    }

    public static CustomFile compressFiles(List<CustomFile> files, String zipFileName) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ZipOutputStream zos = new ZipOutputStream(baos);
        zos.setLevel(Deflater.DEFAULT_COMPRESSION);
        zos.setMethod(Deflater.DEFLATED);
        try {
            for (CustomFile file : files) {
                ZipEntry zipEntry = new ZipEntry(file.getFileNameWithExtension());
                ByteArrayInputStream bais = new ByteArrayInputStream(file.getBytes());
                zos.putNextEntry(zipEntry);

                byte[] buffer = new byte[1024];
                int leido;
                while (0 < (leido = bais.read(buffer))) {
                    zos.write(buffer, 0, leido);
                }
                bais.close();
                zos.closeEntry();
            }
            zos.close();
        } catch (IOException e) {
            throw new AppException(Messages.file_cantCompress);
        }

        byte[] bytes = baos.toByteArray();
        return new CustomFile(bytes, zipFileName, CustomFileExtension.ZIP);
    }

    public static List<CustomFile> decompressZip(byte[] zipBytes) {
        List<CustomFile> result = new ArrayList<>();
        ByteArrayInputStream bais = new ByteArrayInputStream(zipBytes);
        ZipInputStream zis = new ZipInputStream(bais);
        try {
            for (ZipEntry zipEntry = zis.getNextEntry(); zipEntry != null; zipEntry = zis.getNextEntry()) {
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                int read;
                byte[] buffer = new byte[1024];
                while (0 < (read = zis.read(buffer))) baos.write(buffer, 0, read);
                zis.closeEntry();
                baos.close();

                CustomFile file = new CustomFile(baos.toByteArray(), zipEntry.getName());
                result.add(file);
            }
        } catch (IOException e) {
            throw new AppException(Messages.file_cantDecompress);
        }
        return result;
    }

    public static void saveUploadXmls(List<CustomFile> xmlsToSend, Path uploadPath) {
        for (CustomFile xmlFile : xmlsToSend) {
            saveFile(uploadPath, xmlFile);
        }
    }

    public static byte[] getFileFromPath(Path path) {
        try {
            return Files.readAllBytes(path);
        } catch (IOException e) {
            throw new AppException(Messages.file_cantRead);
        }
    }
}
