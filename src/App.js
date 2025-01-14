import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import "./App.css";

export default function App() {
  const { width, height } = useWindowSize();
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [numOfRolls, setNumOfRolls] = React.useState(0);
  let bestVal = localStorage.getItem("Best") || 0;

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      if (bestVal === 0 || numOfRolls < bestVal) {
        localStorage.setItem("Best", numOfRolls);
      }
    }
  }, [dice, bestVal, numOfRolls]);

  function generateNewDie() {
    let rand = Math.ceil(Math.random() * 6);
    return {
      value: rand,
      image: `dice-six-faces-${rand}.svg`,
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice(event) {
    setNumOfRolls((value) => value + 1);
    if (tenzies || event.target.value === "restart") {
      setNumOfRolls(0);
      setDice(allNewDice());
      setTenzies(false);
    } else {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      image={die.image}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti width={width} height={height} />}
      <div className="top-lane">
        <div className="current">Rolls: {numOfRolls}</div>
        <h1 className="title mains">Tenzies</h1>
        <div className="best">Best Score: {bestVal}</div>
      </div>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      <button className="restart" onClick={rollDice} value="restart">
        Restart
      </button>
    </main>
  );
}
