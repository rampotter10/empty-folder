package com.example.hotel.controller;

import com.example.hotel.model.Room;
import com.example.hotel.repository.RoomRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomRepository roomRepository;

    @GetMapping
    public List<Room> list() {
        return roomRepository.findAll();
    }

    @GetMapping("/{id}")
    public Room get(@PathVariable Long id) {
        return roomRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Room create(@Valid @RequestBody Room room) {
        return roomRepository.save(room);
    }

    @PutMapping("/{id}")
    public Room update(@PathVariable Long id, @Valid @RequestBody Room updated) {
        Room room = roomRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        room.setNumber(updated.getNumber());
        room.setType(updated.getType());
        room.setPricePerNight(updated.getPricePerNight());
        room.setDescription(updated.getDescription());
        return roomRepository.save(room);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        roomRepository.deleteById(id);
    }
}