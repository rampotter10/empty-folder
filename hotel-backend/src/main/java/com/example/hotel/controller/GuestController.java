package com.example.hotel.controller;

import com.example.hotel.model.Guest;
import com.example.hotel.repository.GuestRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
@RequiredArgsConstructor
public class GuestController {

    private final GuestRepository guestRepository;

    @GetMapping
    public List<Guest> list() {
        return guestRepository.findAll();
    }

    @GetMapping("/{id}")
    public Guest get(@PathVariable Long id) {
        return guestRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Guest create(@Valid @RequestBody Guest guest) {
        return guestRepository.save(guest);
    }

    @PutMapping("/{id}")
    public Guest update(@PathVariable Long id, @Valid @RequestBody Guest updated) {
        Guest guest = guestRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        guest.setFirstName(updated.getFirstName());
        guest.setLastName(updated.getLastName());
        guest.setEmail(updated.getEmail());
        guest.setPhone(updated.getPhone());
        return guestRepository.save(guest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        guestRepository.deleteById(id);
    }
}