package com.cibertec.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "visitors")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Visitor {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false, length = 8, unique = true)
  private String dni;

  @Column(nullable = false, length = 100)
  private String firstName;

  @Column(nullable = false, length = 100)
  private String paternalLastName;

  @Column(nullable = false, length = 100)
  private String maternalLastName;

  @CreationTimestamp
  @Column(updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  // Métodos adicionales para compatibilidad
  public String getDni() {
    return dni;
  }

  public void setDni(String dni) {
    this.dni = dni;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getPaternalLastName() {
    return paternalLastName;
  }

  public void setPaternalLastName(String paternalLastName) {
    this.paternalLastName = paternalLastName;
  }

  public String getMaternalLastName() {
    return maternalLastName;
  }

  public void setMaternalLastName(String maternalLastName) {
    this.maternalLastName = maternalLastName;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public Integer getId() {
    return id;
  }

  public static VisitorBuilder builder() {
    return new VisitorBuilder();
  }

  public static class VisitorBuilder {
    private Integer id;
    private String dni;
    private String firstName;
    private String paternalLastName;
    private String maternalLastName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public VisitorBuilder id(Integer id) {
      this.id = id;
      return this;
    }

    public VisitorBuilder dni(String dni) {
      this.dni = dni;
      return this;
    }

    public VisitorBuilder firstName(String firstName) {
      this.firstName = firstName;
      return this;
    }

    public VisitorBuilder paternalLastName(String paternalLastName) {
      this.paternalLastName = paternalLastName;
      return this;
    }

    public VisitorBuilder maternalLastName(String maternalLastName) {
      this.maternalLastName = maternalLastName;
      return this;
    }

    public VisitorBuilder createdAt(LocalDateTime createdAt) {
      this.createdAt = createdAt;
      return this;
    }

    public VisitorBuilder updatedAt(LocalDateTime updatedAt) {
      this.updatedAt = updatedAt;
      return this;
    }

    public Visitor build() {
      Visitor visitor = new Visitor();
      visitor.id = this.id;
      visitor.dni = this.dni;
      visitor.firstName = this.firstName;
      visitor.paternalLastName = this.paternalLastName;
      visitor.maternalLastName = this.maternalLastName;
      visitor.createdAt = this.createdAt;
      visitor.updatedAt = this.updatedAt;
      return visitor;
    }
  }
}
