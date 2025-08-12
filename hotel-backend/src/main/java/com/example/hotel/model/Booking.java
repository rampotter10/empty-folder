package com.example.hotel.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id", nullable = false)
    private Guest guest;

    @NotNull
    @Column(nullable = false)
    private LocalDate checkInDate;

    @NotNull
    @Column(nullable = false)
    private LocalDate checkOutDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @NotNull
    @DecimalMin("0.0")
    @Column(nullable = false)
    private BigDecimal totalPrice;
}