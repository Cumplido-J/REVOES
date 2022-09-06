package mx.edu.cecyte.sisec.devfunctions;

import mx.edu.cecyte.sisec.dto.webServiceCertificate.CryptographyLogin;

import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class CryptographyAES {

    //private static  String typeAlgorithm ="AES/CBC/PKCS5Padding";
    private static  String typeAlgorithm ="AES/ECB/PKCS5Padding";
    private static int typeKey = 256;

    public static SecretKey generateKey( int n) throws NoSuchAlgorithmException {
        KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
        keyGenerator.init(n);
        SecretKey key = keyGenerator.generateKey();

        return key;
    }

    public static String encrypt(String algorithm, String input, SecretKey key) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
        Cipher cipher = Cipher.getInstance(algorithm);
        cipher.init(Cipher.ENCRYPT_MODE, key);
        byte[] cipherText = cipher.doFinal(input.getBytes());
        return Base64.getEncoder()
                .encodeToString(cipherText);
    }

    public static String decrypt(String algorithm, String cipherText, byte [] key) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {

        SecretKey keyResponse=new SecretKeySpec(key,"AES");
        Cipher cipher = Cipher.getInstance(algorithm);
        cipher.init(Cipher.DECRYPT_MODE, keyResponse);
        return new String( cipher.doFinal( Base64.getDecoder().decode(cipherText) ) );
    }

    public static CryptographyLogin Encrypt_Success(String input,String input2) {
        try {
            SecretKey key = generateKey(typeKey);
            String cipherText = encrypt(typeAlgorithm, input, key);
            String cipherText2 = encrypt(typeAlgorithm, input2, key);
            return new CryptographyLogin(cipherText, cipherText2, key.getEncoded());
        }catch (Exception e){
            return new CryptographyLogin( null, null);
        }
    }

    public static CryptographyLogin Dencrypt_Success( String dencript1, String dencript2, byte [] key) {
        try {
            String R1 =decrypt(typeAlgorithm, dencript1, key);
            String R2 =decrypt(typeAlgorithm, dencript2, key);
            return new CryptographyLogin(R1,R2);
        }catch (Exception e){
            return  new CryptographyLogin(null,null);
        }
    }

    public static CryptographyLogin Dencrypt_Success( String dencript1, byte [] key) {
        try {
            String R1 =decrypt(typeAlgorithm, dencript1, key);
            return new CryptographyLogin(null,R1);
        }catch (Exception e){
            return  new CryptographyLogin(null,"NA");
        }
    }


}
