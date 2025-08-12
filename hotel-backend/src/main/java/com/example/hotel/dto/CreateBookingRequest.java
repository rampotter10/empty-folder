package com.example.hotel.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateBookingRequest(
        @NotNull Long roomId,
        @NotNull Long guestId,
        @NotNull LocalDate checkInDate,
        @NotNull LocalDate checkOutDate
) {}