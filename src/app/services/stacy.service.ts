import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StacyService {
  stacyQuotes = {
    welcome: [
      "Hey there! Ready to escape this chaos? 😏",
      "So you're the one brave enough to face this. Interesting.",
      "Welcome to the fun house. Buckle up."
    ],
    room1Enter: [
      "Welcome to the data center. There's a deadlock somewhere. Try not to add to it.",
      "Three constraints, one project. Triangle of doom. You'll figure it out. Probably.",
      "Speed, Cost, Quality. Pick all three. That's the trick. (It's not. There's no trick.)"
    ],
    room1Success: [
      "Deadlock resolved. The orb just turned blue. That's a good sign. I think.",
      "725. Solid number. Solid you. Project authorized.",
      "Alignment confirmed. The data center has stopped screaming. You're welcome."
    ],
    room2Enter: [
      "Welcome to the Leadership Archive. Where the classics quietly run the show.",
      "Some clues hide in plain sight. Especially the ones with handles, ink, and chrome.",
      "If you're going to lead, learn from the foundations. Click around. Pay attention."
    ],
    room2Success: [
      "Foundations confirmed. Turns out you do know your roots.",
      "1908 — the year it all started. And apparently the year you cracked it.",
      "Door's open. The archive trusts you. Cautiously."
    ],
    room3Enter: [
      "Calibration Lab. AKA: the place where org structures go to die.",
      "Can you build a team that actually works together? Let's find out.",
      "This is where theory meets reality. And reality is messy."
    ],
    room3Success: [
      "You assembled a team. And nobody quit. That's a win in my book.",
      "Not bad. Not bad at all. Maybe you actually understand org dynamics.",
      "The restructure works. Somehow. I'm suspicious, but impressed."
    ],
    wrongAttempt: [
      "Nope, try again.",
      "Not quite. Want a hint, or should I let you suffer a bit longer?",
      "That's... not it. But I admire the confidence.",
      "Close! (It's not, I'm lying to be nice.)"
    ],
    vaultEnter: [
      "Alright, final test. Don't mess this up.",
      "6 digits. 3 rooms. You know what to do.",
      "The vault awaits. Try not to brain-lock now."
    ],
    vaultSuccess: [
      "You did it. You actually escaped the uncertainty. Impressive.",
      "Welcome to freedom. Or the next set of problems. Probably that one.",
      "The vault is open. The team is free. Go forth and lead like you mean it."
    ]
  };

  getRandomQuote(category: string): string {
    const quotes = this.stacyQuotes[category as keyof typeof this.stacyQuotes] || ['Stacy is speechless. (Not really.)'];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  getSpecificQuote(category: string, index: number = 0): string {
    const quotes = this.stacyQuotes[category as keyof typeof this.stacyQuotes] || ['Stacy is speechless. (Not really.)'];
    return quotes[index] || quotes[0];
  }
}
