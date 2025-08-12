package com.example.hotel.repository;

import com.example.hotel.model.Booking;
import com.example.hotel.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
            "WHERE b.room.id = :roomId AND b.status = :status " +
            "AND b.checkInDate < :newCheckOut AND b.checkOutDate > :newCheckIn")
    boolean hasOverlap(@Param("roomId") Long roomId,
                       @Param("status") BookingStatus status,
                       @Param("newCheckIn") LocalDate newCheckIn,
                       @Param("newCheckOut") LocalDate newCheckOut);

    @Query("SELECT b FROM Booking b JOIN FETCH b.room JOIN FETCH b.guest")
    List<Booking> findAllWithAssociations();
}