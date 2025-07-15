package dev.ple.voice_crud.transactions.web;

import dev.ple.voice_crud.transactions.Transaction;
import dev.ple.voice_crud.transactions.TransactionService;
import io.github.wimdeblauwe.htmx.spring.boot.mvc.HxRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("transactions", service.findAll());
        return "transactions/list";
    }

    @GetMapping("/search")
    @HxRequest
    public String htmxSearchTransactions(@RequestParam String search, Model model) {
        model.addAttribute("transactions", service.search(search));
        return "fragments :: transactionRows";
    }

    @GetMapping("/search")
    public String searchTransactions(@RequestParam String search, Model model) {
        model.addAttribute("searchKey", search);
        model.addAttribute("transactions", service.search(search));
        return "transactions/list";
    }

    @GetMapping("/new")
    public String createForm(Model model) {
        model.addAttribute("transaction", new Transaction());
        return "transactions/form";
    }

    @PostMapping
    public String save(@ModelAttribute Transaction transaction) {
        service.save(transaction);
        return "redirect:/transactions";
    }

    @PostMapping("/add")
    public ResponseEntity<Transaction> addTransaction(@RequestBody Transaction transaction) {
       var t = service.save(transaction);
        return ResponseEntity.ok(t);
    }

    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        Transaction transaction = service.findById(id).orElseThrow();
        model.addAttribute("transaction", transaction);
        return "transactions/form";
    }

    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteById(id);
        return "redirect:/transactions";
    }
}

