CREATE TABLE transaction (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              date DATE NOT NULL,
                              description VARCHAR(255) NOT NULL,
                              category VARCHAR(100) NOT NULL,
                              amount DECIMAL(10, 2) NOT NULL,
                              status VARCHAR(50) NOT NULL
);