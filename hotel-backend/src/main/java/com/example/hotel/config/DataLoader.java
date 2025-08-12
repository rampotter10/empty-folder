package com.example.hotel.config;

import com.example.hotel.model.Guest;
import com.example.hotel.model.Room;
import com.example.hotel.model.RoomType;
import com.example.hotel.repository.GuestRepository;
import com.example.hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
@RequiredArgsConstructor
public class DataLoader {

    private final RoomRepository roomRepository;
    private final GuestRepository guestRepository;

    @Bean
    public ApplicationRunner loadSampleData() {
        return args -> {
            if (roomRepository.count() == 0) {
                roomRepository.save(Room.builder().number("101").type(RoomType.SINGLE).pricePerNight(new BigDecimal("80.00")).description("Cozy single room").build());
                roomRepository.save(Room.builder().number("102").type(RoomType.DOUBLE).pricePerNight(new BigDecimal("120.00")).description("Spacious double room").build());
                roomRepository.save(Room.builder().number("201").type(RoomType.SUITE).pricePerNight(new BigDecimal("200.00")).description("Luxury suite").build());
            }
            if (guestRepository.count() == 0) {
                guestRepository.save(Guest.builder().firstName("John").lastName("Doe").email("john.doe@example.com").phone("+1234567890").build());
            }
        };
    }
}