package com.resilience4j;

import com.resilience4j.domain.Dog;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/dogs")
@RequiredArgsConstructor
public class DogController {

    private static final String URL = "http://localhost:8091/pets/get-a-name";

    @GetMapping("/get-all")
    @Retry(name = "dog", fallbackMethod = "getDefaultDog")
    public ResponseEntity<List<Dog>> getAllDogs() {
        log.info("Sending request to /my-fake-uri");
        final ResponseEntity<Dog> response = new RestTemplate().getForEntity("/my-fake-uri", Dog.class);
        return new ResponseEntity<>(List.of(response.getBody()), HttpStatus.OK);
    }

    @GetMapping("/get-one")
    @CircuitBreaker(name = "cat", fallbackMethod = "getDefaultDog")
    public ResponseEntity<String> getOneDog() {
        log.info("Sending request to {}", URL);
        final ResponseEntity<String> response = new RestTemplate().getForEntity(URL, String.class);
        log.info("Response body {}", response.getBody());
        return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
    }

    @GetMapping("/get-one-fish")
    @RateLimiter(name = "fish")
    public ResponseEntity<String> getOneFish() {
        log.info("Sending request to {}", URL);
        final ResponseEntity<String> response = new RestTemplate().getForEntity(URL, String.class);
        log.info("Response body {}", response.getBody());
        return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
    }

    public ResponseEntity<List<Dog>> getDefaultDog(Exception e) {
        log.info("Getting default dog as callback, error: {}", e.getMessage());
        final Dog deimos = Dog.builder().age(1).name("Deimos").breed("Pitbull terrier").build();
        return new ResponseEntity<>(List.of(deimos), HttpStatus.OK);
    }
}
