import dotenv from "dotenv";
import fs from "fs";
import { Resend } from "resend";

dotenv.config();

type person = {
  name: string;
  mail: string;
};

function getPeopleFromFileSync(): person[] {
  try {
    const data = fs.readFileSync("./people.json", "utf8");
    const users = JSON.parse(data);
    return users;
  } catch (err) {
    console.error("Error reading or parsing the file:", err);
    return []; // in case of an error, return an empty array
  }
}

function getShuffledArray(n: number) {
  // Create an array of numbers from 0 to n-1
  let array = Array.from({ length: n }, (_, index) => index);

  // Shuffle the array using the Fisher-Yates shuffle algorithm
  for (let i = n - 1; i > 0; i--) {
    // Generate a random index before the current element
    const j = Math.floor(Math.random() * (i + 1));

    // Swap the elements at indexes i and j
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function getNonStationaryPermutation(n: number) {
  while (true) {
    const candidate = getShuffledArray(n);
    const isValid = candidate.every((target, index) => {
      return target !== index;
    });
    if (isValid) return candidate;
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendMail(recipient: string, subject: string, text: string) {
  console.log(recipient);
  const { data, error } = await resend.emails.send({
    from: `Secret Santa <${process.env.MY_EMAIL!}>`,
    to: [recipient],
    subject,
    text,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}

async function run() {
  const recipients = getPeopleFromFileSync();
  const permutation = getNonStationaryPermutation(recipients.length);

  const messagesData = recipients.map((recipient, index) => {
    return { ...recipient, targetName: recipients[permutation[index]].name };
  });

  for (const message of messagesData) {
    sendMail(
      message.mail,
      "Wesołych Świąt - mikołajowe prezetowe losowanie",
      `Kochany współstudencie ${message.name},\nczas rozpocząć swiateczną magie od podarowania prezentu za nie więcej niz 50 złotych.\nOsoba którą wylosowalscie to: ${message.targetName}\nWesołego Prezentowania, \nBiuro do spraw wolantariuszy bieguna połnocnego.`
    )
      .then((result) => console.log("Email sent...", result))
      .catch((error) => console.log(error.message));
    await new Promise<void>((res) => {
      setTimeout(res, 2000);
    });
  }
}

run();
