package net.javaguides.ems.service.impl;

import net.javaguides.ems.service.OtpService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpServiceImpl implements OtpService {

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    private static class OtpData {
        String otp;
        LocalDateTime expiry;

        OtpData(String otp, LocalDateTime expiry) {
            this.otp = otp;
            this.expiry = expiry;
        }
    }

    @Override
    public String generateOtp(String email) {
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);
        otpStorage.put(email, new OtpData(otp, expiry));
        return otp;
    }

    @Override
    public boolean isOtpValid(String email, String otp) {
        OtpData data = otpStorage.get(email);
        if (data != null && data.otp.equals(otp)) {
            if (data.expiry.isAfter(LocalDateTime.now())) {
                return true;
            } else {
                otpStorage.remove(email); // Clean up expired OTP
                return false;
            }
        }
        return false;
    }

    @Override
    public void clearOtp(String email) {
        otpStorage.remove(email);
    }
}
