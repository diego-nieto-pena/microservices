package com.pets;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/pets")
public class PetController {

    @GetMapping("/get-a-name")
    public String getAName() {
        return "Deimos";
    }
}
