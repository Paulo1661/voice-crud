-- INSERT INTO transaction (date, description, category, amount, status)
-- VALUES ('2024-07-26', 'Grocery shopping at SuperMart', 'Groceries', -75.50, 'Completed'),
--        ('2024-07-25', 'Salary deposit', 'Income', 3500.00, 'Completed'),
--        ('2024-07-24', 'Dinner at The Bistro', 'Dining', -60.00, 'Completed'),
--        ('2024-07-23', 'Online purchase from TechGadgets', 'Electronics', -250.00, 'Completed'),
--        ('2024-07-22', 'Rent payment', 'Housing', -1500.00, 'Completed'),
--        ('2024-07-21', 'Coffee at Cafe Aroma', 'Coffee', -5.00, 'Completed'),
--        ('2024-07-20', 'Gasoline', 'Transportation', -40.00, 'Completed'),
--        ('2024-07-19', 'Movie tickets', 'Entertainment', -30.00, 'Completed'),
--        ('2024-07-18', 'Gym membership', 'Fitness', -50.00, 'Completed'),
--        ('2024-07-17', 'Transfer to savings account', 'Savings', -500.00, 'Completed');


INSERT INTO transaction (date, description, category, amount, status)
VALUES
    ('2024-07-25', 'Virement salaire de Paul', 'Revenu', 3200.00, 'Terminé'),
    ('2024-07-24', 'Dîner en famille au restaurant Le Gourmet', 'Restaurant', -78.00, 'Terminé'),
    ('2024-07-22', 'Paiement du loyer', 'Logement', -1400.00, 'Terminé'),

    ('2024-07-15', 'Facture électricité EDF', 'Services publics', -95.30, 'Terminé'),
    ('2024-06-15', 'Paiement facture Internet', 'Services publics', -40.00, 'Terminé'),
    ('2024-06-10', 'Essence pour voiture', 'Transport', -48.90, 'Terminé'),

    ('2024-06-03', 'Paiement du loyer', 'Logement', -1400.00, 'Terminé');
