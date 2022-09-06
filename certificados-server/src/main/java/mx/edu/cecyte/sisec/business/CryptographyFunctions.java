package mx.edu.cecyte.sisec.business;

import mx.edu.cecyte.sisec.classes.Fiel;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.ssl.PKCS8Key;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

public class CryptographyFunctions {

    public static String signWithKey(Fiel fiel, String string) {
        try {
            PKCS8Key pkcs8Key = new PKCS8Key(fiel.getKey(), fiel.getPassword().toCharArray());
            PrivateKey privateKey = pkcs8Key.getPrivateKey();
            Signature signature = Signature.getInstance("SHA256withRSA");
            signature.initSign(privateKey);
            signature.update(string.getBytes(StandardCharsets.UTF_8));
            byte[] selloBytes = signature.sign();
            return Base64.encodeBase64String(selloBytes);
        } catch (GeneralSecurityException e) {
            throw new AppException(Messages.cryptography_fielWrongPassword);
        } catch (Exception e) {
            throw new AppException(Messages.cryptography_fielError);
        }
    }

    public static String getCertificateNumber(byte[] cerBytes) {
        try {
            CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
            InputStream in = new ByteArrayInputStream(cerBytes);
            X509Certificate cert = (X509Certificate) certFactory.generateCertificate(in);
            byte[] byteArray = cert.getSerialNumber().toByteArray();
            return new String(byteArray);
        } catch (CertificateException e) {
            throw new AppException(Messages.cryptography_fielWrongCer);
        } catch (Exception e) {
            throw new AppException(Messages.cryptography_fielError);
        }
    }
}
