package dev.ple.voice_crud.transactions;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByDescriptionContainingIgnoreCaseOrCategoryContainingIgnoreCase(String desc, String cat);
}


