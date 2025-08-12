package com.example.hotel.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;

@Entity
@Table(name = "rooms", uniqueConstraints = @UniqueConstraint(columnNames = "number"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String number;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomType type;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false)
    private BigDecimal pricePerNight;

    private String description;
}