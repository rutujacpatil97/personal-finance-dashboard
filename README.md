## State Management Choice
This project uses Angular Signals for state management.

Signals provide synchronous, fine-grained reactivity and remove the need for manual
subscriptions. Derived state such as total balance is handled using computed signals,
resulting in cleaner and more predictable code.

## How to Run the Project

cd personal-finance-dashboard

npm install

ng serve

## Mock Backend
This project uses **json-server** for mocking APIs.

Run the mock server:

Find where the db.json file is located

cd personal-finance-dashboard

npx json-server --watch db.json --port 3000


You can directly hit the following URL:
http://localhost:3000/transactions
