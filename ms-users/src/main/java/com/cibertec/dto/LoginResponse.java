package com.cibertec.dto;

public class LoginResponse {
    
    private boolean success;
    private String message;
    private String token;
    private UserResponse user;
    
    // Constructores
    public LoginResponse() {}
    
    public LoginResponse(boolean success, String message, String token, UserResponse user) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user;
    }
    
    // Constructor para respuesta de error
    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.token = null;
        this.user = null;
    }
    
    // Getters y Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public UserResponse getUser() {
        return user;
    }
    
    public void setUser(UserResponse user) {
        this.user = user;
    }
    
    @Override
    public String toString() {
        return "LoginResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", token='" + (token != null ? "[TOKEN_PRESENT]" : "null") + '\'' +
                ", user=" + user +
                '}';
    }
}