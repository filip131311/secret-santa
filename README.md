# secret-santa

This is a project that allows for automating secret santa. 
It takes a list of people and their email and sends an email to all off them 
with the result of the draft. 

### Prerequisites 

The script requires working [resend](https://resend.com/) account. 

### Configuration

- Copy `.env.example` file to `.env` and put your credentials in there.
- Copy `people.json.example` file to `people.json` ad feal it with the list of your users.

### Usage

to run the script use commands: 
```
npm i 
npm run start 
```