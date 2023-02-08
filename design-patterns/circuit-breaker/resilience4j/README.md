# Resilience4j - Circuit Breaker
 Adding the proper dependency will allow to use the Resilience4j circuit breaker tool.
 
```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
</dependency>
```

## @Retry annotation
Use it to define the **configuration** and the **fallback method**.

```
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
@Documented
public @interface Retry {
    String name();

    String fallbackMethod() default "";
}
```

### Configuration

By default `default` configuration is used, it can be changed by a custom configuration.

```
@GetMapping("/get-all")
@Retry(name = "dog")
public ResponseEntity<List<Dog>> getAllDogs() {
    log.info("Sending request to /my-fake-uri");
    final ResponseEntity<Dog> response = new RestTemplate().getForEntity("/my-fake-uri", Dog.class);
    return new ResponseEntity<>(List.of(response.getBody()), HttpStatus.OK);
}
```

**'dogs'** configuration:
```
resilience4j.retry.instances.dog.maxAttempts=2 # maximum number of retry attempts before failure
resilience4j.retry.instances.dog.waitDuration=10s # wait time before retry
```

Note the 10 seconds difference between each call:
```
2023-02-08T17:39:02.337+01:00  INFO 59316 --- [nio-8090-exec-1] com.resilience4j.DogController           : Sending request to /my-fake-uri
2023-02-08T17:39:12.356+01:00  INFO 59316 --- [nio-8090-exec-1] com.resilience4j.DogController           : Sending request to /my-fake-uri
2023-02-08T17:39:12.380+01:00 ERROR 59316 --- [nio-8090-exec-1] o.a.c.c.C.[.[.[/].[dispatcherServlet]    : error trace ...
```
Exponential backoff
```
# maximum number of retry attempts before failure
resilience4j.retry.instances.dog.maxAttempts=5
# wait time before retry
resilience4j.retry.instances.dog.waitDuration=1s
#Increase wait time exponentially
resilience4j.retry.instances.dog.enableExponentialBackoff=true
```
```
2023-02-08T17:49:33.228+01:00  INFO 60087 --- [nio-8090-exec-1] com.resilience4j.DogController           : Sending request to /my-fake-uri
2023-02-08T17:49:34.243+01:00  INFO 60087 --- [nio-8090-exec-1] com.resilience4j.DogController           : Sending request to /my-fake-uri
2023-02-08T17:49:35.751+01:00  INFO 60087 --- [nio-8090-exec-1] com.resilience4j.DogController           : Sending request to /my-fake-uri
2023-02-08T17:49:38.007+01:00  INFO 60087 --- [nio-8090-exec-1] com.resilience4j.DogController           : Sending request to /my-fake-uri
2023-02-08T17:49:41.390+01:00  INFO 60087 --- [nio-8090-exec-1] com.resilience4j.DogController           : Sending request to /my-fake-uri
```

## Callback function
A callback function can be defined as default response in case of failure, the callback method should take as parameter 
a Throwable object:
```
@GetMapping("/get-all")
@Retry(name = "dog", fallbackMethod = "getDefaultDog")
public ResponseEntity<List<Dog>> getAllDogs() {
    log.info("Sending request to /my-fake-uri");
    final ResponseEntity<Dog> response = new RestTemplate().getForEntity("/my-fake-uri", Dog.class);
    return new ResponseEntity<>(List.of(response.getBody()), HttpStatus.OK);
}

public ResponseEntity<List<Dog>> getDefaultDog(Exception e) {
    log.info("Getting default dog as callback, error: {}", e.getMessage());
    final Dog deimos = Dog.builder().age(1).name("Deimos").breed("Pitbull terrier").build();
    return new ResponseEntity<>(List.of(deimos), HttpStatus.OK);
}
```

```
2023-02-08T17:56:50.082+01:00  INFO 60607 --- [nio-8090-exec-1] com.resilience4j.DogController           : Sending request to /my-fake-uri
2023-02-08T17:56:51.095+01:00  INFO 60607 --- [nio-8090-exec-1] com.resilience4j.DogController           : Sending request to /my-fake-uri
2023-02-08T17:56:52.602+01:00  INFO 60607 --- [nio-8090-exec-1] com.resilience4j.DogController           : Sending request to /my-fake-uri
2023-02-08T17:56:54.856+01:00  INFO 60607 --- [nio-8090-exec-1] com.resilience4j.DogController           : Sending request to /my-fake-uri
2023-02-08T17:56:58.240+01:00  INFO 60607 --- [nio-8090-exec-1] com.resilience4j.DogController           : Sending request to /my-fake-uri
2023-02-08T17:56:58.244+01:00  INFO 60607 --- [nio-8090-exec-1] com.resilience4j.DogController           : Getting default dog as callback, error: URI is not absolute
```

Default response:

```
[
  {
    "name":"Deimos",
    "breed":"Pitbull terrier",
    "age":1
  }
]
```

## @CircuitBreaker annotation
`https://resilience4j.readme.io/docs/circuitbreaker`

```
@GetMapping("/get-one")
@CircuitBreaker(name = "default", fallbackMethod = "getDefaultDog")
public ResponseEntity<Dog> getOneDog() {
    log.info("Sending request to /my-fake-uri");
    final ResponseEntity<Dog> response = new RestTemplate().getForEntity("/my-fake-uri", Dog.class);
    return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
}
```
Will be making use of the circuit breaker pattern, once a component starts failing, the request can be retried until the
threshold is reached, once reached the circuit will be open and all request will be return immediately by returning the callback
response, instead of executing the actual request.

```
2023-02-08T18:16:32.727+01:00  INFO 61993 --- [nio-8090-exec-1] com.resilience4j.DogController           : Sending request to /my-fake-uri
...
2023-02-08T18:16:46.452+01:00  INFO 61993 --- [nio-8090-exec-5] com.resilience4j.DogController           : Sending request to /my-fake-uri
2023-02-08T18:16:46.876+01:00  INFO 61993 --- [nio-8090-exec-1] com.resilience4j.DogController           : Getting default dog as callback, error: CircuitBreaker 'default' is OPEN and does not permit further calls
```
The failure rate threshold iis defined as a percentage.

When the failure rate is equal or greater than the threshold the CircuitBreaker transitions to open and starts short-circuiting calls.
```
resilience4j.circuitbreaker.instances.cat.failure-rate-threshold=30
```
Maximum request number in half-open state
```
resilience4j.circuitbreaker.instances.cat.permitted-number-of-calls-in-half-open-state=3
```
Maximum wait duration in half-open state:
```
resilience4j.circuitbreaker.instances.cat.maxWaitDurationInHalfOpenState=1000
```
Maximum wait duration in open state before changing to half-open
```
resilience4j.circuitbreaker.instances.cat.waitDurationInOpenState=5000
```

Once the component start failing the callback method will be called, after retrial.
```
2023-02-08T20:46:38.312+01:00  INFO 81587 --- [nio-8090-exec-1] com.resilience4j.DogController           : Sending request to http://localhost:8091/pets/get-a-name
2023-02-08T20:46:38.313+01:00  INFO 81587 --- [nio-8090-exec-1] com.resilience4j.DogController           : Response body Deimos
2023-02-08T20:46:38.430+01:00  INFO 81587 --- [nio-8090-exec-3] com.resilience4j.DogController           : Sending request to http://localhost:8091/pets/get-a-name
2023-02-08T20:46:38.433+01:00  INFO 81587 --- [nio-8090-exec-3] com.resilience4j.DogController           : Getting default dog as callback, error: I/O error on GET request for "http://localhost:8091/pets/get-a-name": Connection refused
```

Once the threshold is reached CircuitBreaker will not allow calls until its open state timeout is reached, returning the 
fallback response immediately, and then after open state timeout is reached it will allow the configured half-open state calls.
```
2023-02-08T20:46:47.867+01:00  INFO 81587 --- [nio-8090-exec-3] com.resilience4j.DogController           : Getting default dog as callback, error: CircuitBreaker 'cat' is OPEN and does not permit further calls
2023-02-08T20:46:48.004+01:00  INFO 81587 --- [nio-8090-exec-5] com.resilience4j.DogController           : Getting default dog as callback, error: CircuitBreaker 'cat' is OPEN and does not permit further calls
2023-02-08T20:46:48.140+01:00  INFO 81587 --- [nio-8090-exec-7] com.resilience4j.DogController           : Getting default dog as callback, error: CircuitBreaker 'cat' is OPEN and does not permit further calls
2023-02-08T20:46:48.288+01:00  INFO 81587 --- [nio-8090-exec-9] com.resilience4j.DogController           : Sending request to http://localhost:8091/pets/get-a-name
2023-02-08T20:46:48.289+01:00  INFO 81587 --- [nio-8090-exec-9] com.resilience4j.DogController           : Getting default dog as callback, error: I/O error on GET request for "http://localhost:8091/pets/get-a-name": Connection refused
2023-02-08T20:46:48.425+01:00  INFO 81587 --- [nio-8090-exec-1] com.resilience4j.DogController           : Sending request to http://localhost:8091/pets/get-a-name
2023-02-08T20:46:48.426+01:00  INFO 81587 --- [nio-8090-exec-1] com.resilience4j.DogController           : Getting default dog as callback, error: I/O error on GET request for "http://localhost:8091/pets/get-a-name": Connection refused
2023-02-08T20:46:48.569+01:00  INFO 81587 --- [nio-8090-exec-3] com.resilience4j.DogController           : Sending request to http://localhost:8091/pets/get-a-name
2023-02-08T20:46:48.571+01:00  INFO 81587 --- [nio-8090-exec-3] com.resilience4j.DogController           : Getting default dog as callback, error: I/O error on GET request for "http://localhost:8091/pets/get-a-name": Connection refused
2023-02-08T20:46:48.700+01:00  INFO 81587 --- [nio-8090-exec-5] com.resilience4j.DogController           : Getting default dog as callback, error: CircuitBreaker 'cat' is OPEN and does not permit further calls
2023-02-08T20:46:48.844+01:00  INFO 81587 --- [nio-8090-exec-7] com.resilience4j.DogController           : Getting default dog as callback, error: CircuitBreaker 'cat' is OPEN and does not permit further calls
2023-02-08T20:46:48.979+01:00  INFO 81587 --- [nio-8090-exec-9] com.resilience4j.DogController           : Getting default dog as callback, error: CircuitBreaker 'cat' is OPEN and does not permit further calls
```
If the failure persists, it will go back to open state and retry after open state is over, going to half-open state and 
if is the case to closed state.
```
2023-02-08T20:46:53.503+01:00  INFO 81587 --- [nio-8090-exec-7] com.resilience4j.DogController           : Getting default dog as callback, error: CircuitBreaker 'cat' is OPEN and does not permit further calls
2023-02-08T20:46:53.643+01:00  INFO 81587 --- [nio-8090-exec-9] com.resilience4j.DogController           : Sending request to http://localhost:8091/pets/get-a-name
2023-02-08T20:46:53.705+01:00  INFO 81587 --- [nio-8090-exec-9] com.resilience4j.DogController           : Response body Deimos
2023-02-08T20:46:53.834+01:00  INFO 81587 --- [nio-8090-exec-1] com.resilience4j.DogController           : Sending request to http://localhost:8091/pets/get-a-name
2023-02-08T20:46:53.837+01:00  INFO 81587 --- [nio-8090-exec-1] com.resilience4j.DogController           : Response body Deimos
```

## RateLimiter
`https://resilience4j.readme.io/v0.17.0/docs/ratelimiter`

Restrict the number of request the resource can get by a defined period of time:
- timeout-duration: The default wait time a thread waits for a permission
- limit-refresh-period:	The period of a limit refresh. After each period the rate limiter sets its permissions count back to the limit-for-period value
- limit-for-period: The number of permissions available during one limit refresh period

This case will allow 1 request per second
```
resilience4j.ratelimiter.instances.fish.timeout-duration=1s
resilience4j.ratelimiter.instances.fish.limit-for-period=1
resilience4j.ratelimiter.instances.fish.limit-refresh-period=1s
```

Sending 10 request per second:
```
watch -n 0.1 curl http://localhost:8090/api/v1/dogs/get-one-fish
```

Just one per second is allowed:
```
2023-02-08T21:09:20.912+01:00  INFO 87659 --- [nio-8090-exec-2] com.resilience4j.DogController           : Response body Deimos
2023-02-08T21:09:21.912+01:00  INFO 87659 --- [nio-8090-exec-3] com.resilience4j.DogController           : Response body Deimos
2023-02-08T21:09:22.912+01:00  INFO 87659 --- [nio-8090-exec-4] com.resilience4j.DogController           : Response body Deimos
2023-02-08T21:09:23.910+01:00  INFO 87659 --- [nio-8090-exec-5] com.resilience4j.DogController           : Response body Deimos
2023-02-08T21:09:24.911+01:00  INFO 87659 --- [nio-8090-exec-7] com.resilience4j.DogController           : Response body Deimos
```