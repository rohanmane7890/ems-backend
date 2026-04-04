package net.javaguides.ems.service;

import net.javaguides.ems.dto.LoginRequest;
import net.javaguides.ems.dto.LoginResponse;

public interface AuthService {
	 LoginResponse login(LoginRequest request);
}
