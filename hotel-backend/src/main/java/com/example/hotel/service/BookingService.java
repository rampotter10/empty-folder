package com.example.hotel.service;

import com.example.hotel.dto.CreateBookingRequest;
import com.example.hotel.model.*;
import com.example.hotel.repository.BookingRepository;
import com.example.hotel.repository.GuestRepository;
import com.example.hotel.repository.RoomRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final GuestRepository guestRepository;

    @Transactional(readOnly = true)
    public List<Booking> listAll() {
        return bookingRepository.findAllWithAssociations();
    }

    @Transactional
    public Booking createBooking(CreateBookingRequest request) {
        LocalDate checkIn = request.checkInDate();
        LocalDate checkOut = request.checkOutDate();

        if (checkIn.isAfter(checkOut) || checkIn.isEqual(checkOut)) {
            throw new ValidationException("checkInDate must be before checkOutDate");
        }

        Room room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new EntityNotFoundException("Room not found"));
        Guest guest = guestRepository.findById(request.guestId())
                .orElseThrow(() -> new EntityNotFoundException("Guest not found"));

        boolean overlap = bookingRepository.hasOverlap(room.getId(), BookingStatus.ACTIVE, checkIn, checkOut);
        if (overlap) {
            throw new ValidationException("Room is not available for the selected dates");
        }

        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        BigDecimal total = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        Booking booking = Booking.builder()
                .room(room)
                .guest(guest)
                .checkInDate(checkIn)
                .checkOutDate(checkOut)
                .status(BookingStatus.ACTIVE)
                .totalPrice(total)
                .build();

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }
}