package mx.edu.cecyte.sisec.classes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.io.FilenameUtils;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomFile {
    private byte[] bytes;
    private String fileName;
    private String customFileExtension;

    public String getFileNameWithExtension() {
        return String.format("%s.%s", fileName, customFileExtension);
    }

    public CustomFile(byte[] bytes, String fileName) {
        this.bytes = bytes;
        this.fileName = FilenameUtils.removeExtension(fileName);
        this.customFileExtension = FilenameUtils.getExtension(fileName);
    }
}
