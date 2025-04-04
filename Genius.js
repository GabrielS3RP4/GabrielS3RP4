

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

const GRID_SIZE = 3;
const LEVELS = {
  easy: { steps: 3, speed: 1000 },
  medium: { steps: 5, speed: 700 },
  hard: { steps: 7, speed: 500 },
};

export default function GeniusGame() {
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [flashing, setFlashing] = useState(null);
  const [level, setLevel] = useState('easy');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (playing) startGame();
  }, [level]);

  const startGame = () => {
    let newSequence = [];
    for (let i = 0; i < LEVELS[level].steps; i++) {
      newSequence.push(Math.floor(Math.random() * 9));
    }
    setSequence(newSequence);
    setUserInput([]);
    playSequence(newSequence);
  };

  const playSequence = async (seq) => {
    for (let i = 0; i < seq.length; i++) {
      setTimeout(() => {
        setFlashing(seq[i]);
        setTimeout(() => setFlashing(null), LEVELS[level].speed / 2);
      }, i * LEVELS[level].speed);
    }
  };

  const handlePress = (index) => {
    if (!playing) return;
    const newInput = [...userInput, index];
    setUserInput(newInput);
    
    if (newInput[newInput.length - 1] !== sequence[newInput.length - 1]) {
      Alert.alert('Erro!', 'Você errou a sequência!', [{ text: 'Tentar novamente', onPress: () => startGame() }]);
      return;
    }
    
    if (newInput.length === sequence.length) {
      Alert.alert('Parabéns!', 'Você acertou! Nova rodada iniciando...', [{ text: 'Continuar', onPress: () => addStep() }]);
    }
  };

  const addStep = () => {
    setSequence([...sequence, Math.floor(Math.random() * 9)]);
    setUserInput([]);
    playSequence(sequence);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo Gênios</Text>
      <View style={styles.grid}>
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.square, flashing === index ? styles.active : {}]}
            onPress={() => handlePress(index)}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => setPlaying(true)}>
        <Text style={styles.buttonText}>Iniciar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', width: 180, height: 180 },
  square: { width: 60, height: 60, margin: 2, backgroundColor: '#555' },
  active: { backgroundColor: '#FFD700' },
  button: { marginTop: 20, padding: 10, backgroundColor: '#0A84FF', borderRadius: 5 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
